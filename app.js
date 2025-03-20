// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bus_terminal'
});

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

// Root route: redirect to home
app.get('/', (req, res) => {
  res.redirect('/home');
});

// GET /login
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.render('login', { error: 'An error occurred. Please try again.' });
    }
    if (results.length > 0) {
      req.session.user = results[0];
      return res.redirect('/home');
    }
    res.render('login', { error: 'Invalid credentials. Please try again.' });
  });
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// GET /home (requires login)
// For admin users, load additional summary statistics and recent records.
app.get('/home', isAuthenticated, (req, res) => {
  if (req.session.user.role === 'admin') {
    // Query total bus arrivals
    pool.query("SELECT COUNT(*) AS total FROM arrival", (err, totalArrivalsResult) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving total arrivals");
      }
      const totalArrivals = totalArrivalsResult[0].total;
      
      // Query bus arrivals this month
      pool.query("SELECT COUNT(*) AS total FROM arrival WHERE MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())", (err, monthResult) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving arrivals for this month");
        }
        const totalArrivalsMonth = monthResult[0].total;
        
        // Query bus arrivals this week (using ISO week, adjust if needed)
        pool.query("SELECT COUNT(*) AS total FROM arrival WHERE YEARWEEK(tanggal, 1) = YEARWEEK(CURRENT_DATE(), 1)", (err, weekResult) => {
          if (err) {
            console.error(err);
            return res.send("Error retrieving arrivals for this week");
          }
          const totalArrivalsWeek = weekResult[0].total;
          
          // Query bus arrivals today
          pool.query("SELECT COUNT(*) AS total FROM arrival WHERE DATE(tanggal) = CURRENT_DATE()", (err, todayResult) => {
            if (err) {
              console.error(err);
              return res.send("Error retrieving today's arrivals");
            }
            const totalArrivalsToday = todayResult[0].total;
            
            // Query total registered buses
            pool.query("SELECT COUNT(*) AS total FROM bus", (err, busResult) => {
              if (err) {
                console.error(err);
                return res.send("Error retrieving total buses");
              }
              const totalBuses = busResult[0].total;
              
              // Query total registered terminals
              pool.query("SELECT COUNT(*) AS total FROM terminal", (err, terminalResult) => {
                if (err) {
                  console.error(err);
                  return res.send("Error retrieving total terminals");
                }
                const totalTerminals = terminalResult[0].total;
                
                // Query total registered PO's
                pool.query("SELECT COUNT(*) AS total FROM PO", (err, poResult) => {
                  if (err) {
                    console.error(err);
                    return res.send("Error retrieving total PO's");
                  }
                  const totalPOs = poResult[0].total;
                  
                  // Query total registered users
                  pool.query("SELECT COUNT(*) AS total FROM users", (err, userResult) => {
                    if (err) {
                      console.error(err);
                      return res.send("Error retrieving total users");
                    }
                    const totalUsers = userResult[0].total;
                    
                    // Query 5 most recent arrival records (join to get terminal name)
                    const recentQuery = `
                      SELECT 
                        a.id AS id,
                        DATE_FORMAT(a.tanggal, '%d-%m-%Y') AS tanggal,
                        a.jam,
                        a.nomor_polisi,
                        IFNULL(t_main.nama_terminal, '-') AS nama_terminal
                      FROM arrival a
                      LEFT JOIN terminal t_main ON a.terminal_id = t_main.id
                      ORDER BY a.id DESC
                      LIMIT 5
                    `;
                    pool.query(recentQuery, (err, recentArrivals) => {
                      if (err) {
                        console.error(err);
                        return res.send("Error retrieving recent arrivals");
                      }
                      
                      // Render home.ejs for admin with all statistics
                      res.render("homeAdmin", { 
                        user: req.session.user,
                        totalArrivals: totalArrivals,
                        totalArrivalsMonth: totalArrivalsMonth,
                        totalArrivalsWeek: totalArrivalsWeek,
                        totalArrivalsToday: totalArrivalsToday,
                        totalBuses: totalBuses,
                        totalTerminals: totalTerminals,
                        totalPOs: totalPOs,
                        totalUsers: totalUsers,
                        recentArrivals: recentArrivals
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } else {
    // For non-admin users, you can keep your existing logic.
    // If the user hasn't been assigned a terminal, show the forced terminal modal.
    if (!req.session.user.terminal || req.session.user.terminal === "") {
      pool.query('SELECT * FROM provinsi ORDER BY name', (err, provinsiList) => {
        if (err) {
          console.error(err);
          return res.render('homeOperator', { user: req.session.user, provinsiList: [] });
        }
        return res.render('homeOperator', { user: req.session.user, provinsiList: provinsiList });
      });
    } else {
      // User has a terminal assigned.
      const terminalId = req.session.user.terminal;
      // Retrieve terminal info.
      pool.query("SELECT nama_terminal, alamat FROM terminal WHERE id = ?", [terminalId], (err, terminalInfoResults) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving terminal information.");
        }
        const terminalInfo = terminalInfoResults[0];
        // Retrieve provinsi list for the edit modal.
        pool.query("SELECT id, name FROM provinsi ORDER BY name ASC", (err, provinsiList) => {
          if (err) {
            console.error(err);
            return res.send("Error retrieving provinsi list.");
          }
          // Retrieve summary statistics.
          pool.query("SELECT COUNT(*) AS total FROM arrival WHERE terminal_id = ?", [terminalId], (err, totalRes) => {
            if (err) {
              console.error(err);
              return res.send("Error retrieving total arrivals.");
            }
            const userTotalArrivals = totalRes[0].total;
            pool.query(
              "SELECT COUNT(*) AS total FROM arrival WHERE terminal_id = ? AND MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())",
              [terminalId],
              (err, monthRes) => {
                if (err) {
                  console.error(err);
                  return res.send("Error retrieving arrivals this month.");
                }
                const userTotalArrivalsMonth = monthRes[0].total;
                pool.query(
                  "SELECT COUNT(*) AS total FROM arrival WHERE terminal_id = ? AND YEARWEEK(tanggal, 1) = YEARWEEK(CURRENT_DATE(), 1)",
                  [terminalId],
                  (err, weekRes) => {
                    if (err) {
                      console.error(err);
                      return res.send("Error retrieving arrivals this week.");
                    }
                    const userTotalArrivalsWeek = weekRes[0].total;
                    pool.query(
                      "SELECT COUNT(*) AS total FROM arrival WHERE terminal_id = ? AND DATE(tanggal) = CURRENT_DATE()",
                      [terminalId],
                      (err, todayRes) => {
                        if (err) {
                          console.error(err);
                          return res.send("Error retrieving arrivals today.");
                        }
                        const userTotalArrivalsToday = todayRes[0].total;
                        // Retrieve the 5 most recent arrival records for this terminal.
                        const recentQuery = `
                          SELECT 
                            a.id AS id,
                            DATE_FORMAT(a.tanggal, '%d-%m-%Y') AS tanggal,
                            a.jam,
                            a.nomor_polisi,
                            IFNULL(t_main.nama_terminal, '-') AS nama_terminal
                          FROM arrival a
                          LEFT JOIN terminal t_main ON a.terminal_id = t_main.id
                          WHERE a.terminal_id = ?
                          ORDER BY a.id DESC
                          LIMIT 5
                        `;
                        pool.query(recentQuery, [terminalId], (err, recentArrivals) => {
                          if (err) {
                            console.error(err);
                            return res.send("Error retrieving recent arrivals.");
                          }
                          // Render the operator dashboard.
                          res.render("homeOperator", { 
                            user: req.session.user,
                            terminalInfo: terminalInfo,
                            provinsiList: provinsiList,
                            userTotalArrivals: userTotalArrivals,
                            userTotalArrivalsMonth: userTotalArrivalsMonth,
                            userTotalArrivalsWeek: userTotalArrivalsWeek,
                            userTotalArrivalsToday: userTotalArrivalsToday,
                            userRecentArrivals: recentArrivals
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          });
        });
      });
    }
  }
});

// GET /user-management (User Management Panel - admin only)
app.get('/user-management', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
  
  pool.query('SELECT * FROM provinsi ORDER BY name', (err, provinsiList) => {
    if (err) {
      console.error(err);
      return res.send('Error retrieving provinsi');
    }
    
    const query = `
      SELECT 
        u.id, 
        u.username, 
        u.role, 
        t.nama_terminal AS terminal_name,
        k.name AS kabupaten_name,
        p.name AS provinsi_name
      FROM users u
      LEFT JOIN terminal t ON u.terminal = t.id
      LEFT JOIN kabupaten k ON t.kabupaten_id = k.id
      LEFT JOIN provinsi p ON k.provinsi_id = p.id
    `;
    
    pool.query(query, (err, users) => {
      if (err) {
        console.error(err);
        return res.send('Error retrieving users');
      }
      res.render('userManagement', { 
        user: req.session.user, 
        users: users, 
        error: null, 
        provinsiList: provinsiList 
      });
    });
  });
});

// POST /user-management/create-user (admin only)
app.post('/user-management/create-user', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.render('userManagement', { users: [], error: 'Username, password, and role are required.', provinsiList: [] });
  }
  pool.query(
    'INSERT INTO users (username, password, role, terminal) VALUES (?, ?, ?, ?)',
    [username, password, role, null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.render('userManagement', { users: [], error: 'Error creating user.', provinsiList: [] });
      }
      res.redirect('/user-management');
    }
  );
});

// DELETE /user-management/delete (admin only for deleting specific user)
app.delete('/user-management/delete/:id', isAuthenticated, (req, res) => {
  // Only allow admin to delete users
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing user id.' });
  }
  
  // Delete user query
  pool.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Error deleting user.' });
    }
    return res.json({ success: true });
  });
});

// GET /manajemen-terminal (Manajemen Terminal Page)
app.get('/manajemen-terminal', isAuthenticated, (req, res) => {
  // Only allow admin users
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  
  // Query to retrieve the list of provinsi
  pool.query("SELECT id, name FROM provinsi ORDER BY name", (err, provinsiList) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving provinsi");
    }
    
    // Query to retrieve all terminals joined with their kabupaten and provinsi info
    const terminalQuery = `
      SELECT 
        t.id, 
        t.nama_terminal, 
        t.alamat, 
        k.name AS kabupaten_name, 
        p.name AS provinsi_name 
      FROM terminal t
      LEFT JOIN kabupaten k ON t.kabupaten_id = k.id
      LEFT JOIN provinsi p ON k.provinsi_id = p.id
      ORDER BY t.nama_terminal ASC
    `;
    
    pool.query(terminalQuery, (err, terminals) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving terminals");
      }
      
      // Render the Manajemen Terminal view, passing required variables
      res.render("manajemenTerminal", { 
        user: req.session.user, 
        provinsiList: provinsiList, 
        terminals: terminals 
      });
    });
  });
});

// POST /manajemen-terminal/create (Create a new terminal)
app.post('/manajemen-terminal/create', isAuthenticated, (req, res) => {
  // Only allow admin users to create terminals
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  
  // Extract form fields
  const { provinsi, kabupaten, terminalName, alamat } = req.body;
  if (!provinsi || !kabupaten || !terminalName || !alamat) {
    return res.send("All fields are required.");
  }
  
  // Check if a terminal with the same name already exists in the selected kabupaten
  pool.query(
    "SELECT * FROM terminal WHERE kabupaten_id = ? AND LOWER(nama_terminal) = ?",
    [kabupaten, terminalName.trim().toLowerCase()],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.send("Database error");
      }
      if (results.length > 0) {
        // Terminal already exists
        return res.send("Terminal sudah ada.");
      }
      
      // If not, insert the new terminal record
      pool.query(
        "INSERT INTO terminal (nama_terminal, alamat, kabupaten_id) VALUES (?, ?, ?)",
        [terminalName, alamat, kabupaten],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.send("Error inserting terminal");
          }
          res.redirect('/manajemen-terminal');
        }
      );
    }
  );
});

// POST /manajemen-terminal/edit
app.post('/manajemen-terminal/edit', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  const { terminalId, namaTerminal, alamat, kabupaten } = req.body;
  
  if (!terminalId || !namaTerminal || !alamat || !kabupaten) {
    return res.status(400).json({ success: false, error: 'Missing parameters.' });
  }
  
  const updateQuery = "UPDATE terminal SET nama_terminal = ?, alamat = ?, kabupaten_id = ? WHERE id = ?";
  pool.query(updateQuery, [namaTerminal, alamat, kabupaten, terminalId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Error updating terminal.' });
    }
    return res.json({ success: true });
  });
});

// DELETE /manajemen-terminal/delete/:id
app.delete('/manajemen-terminal/delete/:id', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  const terminalId = req.params.id;
  
  if (!terminalId) {
    return res.status(400).json({ success: false, error: 'Missing terminal id.' });
  }
  
  const deleteQuery = "DELETE FROM terminal WHERE id = ?";
  pool.query(deleteQuery, [terminalId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Error deleting terminal.' });
    }
    return res.json({ success: true });
  });
});

// GET /manajemen-po (Manajemen PO Page)
app.get('/manajemen-po', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  
  pool.query("SELECT id, nama_PO FROM PO ORDER BY nama_PO ASC", (err, poList) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving PO list");
    }
    res.render("manajemenPO", { user: req.session.user, poList: poList });
  });
});

// POST /manajemen-po/create (Create New PO)
app.post('/manajemen-po/create', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  
  const { namaPO } = req.body;
  if (!namaPO) {
    return res.send("Nama PO wajib diisi.");
  }
  
  const newPOName = namaPO.trim();
  
  // Check if the PO already exists (case-insensitive)
  pool.query("SELECT * FROM PO WHERE LOWER(nama_PO) = ?", [newPOName.toLowerCase()], (err, results) => {
    if (err) {
      console.error(err);
      return res.send("Database error.");
    }
    
    if (results.length > 0) {
      return res.send("PO sudah ada.");
    }
    
    // Insert the new PO
    pool.query("INSERT INTO PO (nama_PO) VALUES (?)", [newPOName], (err, insertResult) => {
      if (err) {
        console.error(err);
        return res.send("Error inserting new PO.");
      }
      res.redirect('/manajemen-po');
    });
  });
});

// POST /manajemen-po/edit (Edit PO)
app.post('/manajemen-po/edit', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  const { poId, namaPO } = req.body;
  if (!poId || !namaPO) {
    return res.status(400).json({ success: false, error: 'Missing parameters.' });
  }
  
  const updateQuery = "UPDATE PO SET nama_PO = ? WHERE id = ?";
  pool.query(updateQuery, [namaPO.trim(), poId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Error updating PO.' });
    }
    return res.json({ success: true });
  });
});

// DELETE /manajemen-po/delete (Delete specific PO)
app.delete('/manajemen-po/delete/:id', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  
  const poId = req.params.id;
  if (!poId) {
    return res.status(400).json({ success: false, error: 'Missing PO id.' });
  }
  
  const deleteQuery = "DELETE FROM PO WHERE id = ?";
  pool.query(deleteQuery, [poId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Error deleting PO.' });
    }
    return res.json({ success: true });
  });
});

// GET /get-kabupaten (for dependent dropdowns)
app.get('/get-kabupaten', isAuthenticated, (req, res) => {
  const provinsiId = req.query.provinsi_id;
  pool.query('SELECT id, name FROM kabupaten WHERE provinsi_id = ?', [provinsiId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving kabupaten');
    }
    res.json(results);
  });
});

// GET /get-terminal (for dependent dropdowns)
app.get('/get-terminal', isAuthenticated, (req, res) => {
  const kabupatenId = req.query.kabupaten_id;
  pool.query('SELECT id, nama_terminal FROM terminal WHERE kabupaten_id = ?', [kabupatenId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving terminal');
    }
    res.json(results);
  });
});

// POST /user/update-terminal (for non-admin users)
app.post('/user/update-terminal', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'user') return res.status(403).send('Forbidden');
  const { terminal } = req.body;
  if (!terminal) return res.status(400).send('Terminal is required.');
  pool.query('UPDATE users SET terminal = ? WHERE id = ?', [terminal, req.session.user.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating terminal.');
    }
    req.session.user.terminal = terminal;
    res.send('OK');
  });
});

// GET /kedatangan (Data Kedatangan)
app.get('/kedatangan', isAuthenticated, (req, res) => {
  // For non-admin users without a linked terminal, redirect to /home
  if (req.session.user.role === 'user' && (!req.session.user.terminal || req.session.user.terminal === "")) {
    return res.redirect('/home');
  }
  
  // Build base query without ORDER BY
  const baseQuery = `
    SELECT 
      a.id AS id,
      DATE_FORMAT(a.tanggal, '%d-%m-%Y') AS tanggal, 
      a.jam, 
      IFNULL(po.nama_PO, '-') AS nama_PO, 
      a.nomor_polisi, 
      IFNULL(b.jenis, '-') AS jenis,
      IFNULL(ta.nama_terminal, '-') AS asal, 
      IFNULL(tt.nama_terminal, '-') AS tujuan, 
      a.picture_path, 
      a.terminal_id,
      t_main.nama_terminal AS nama_terminal
    FROM arrival a
    LEFT JOIN bus b ON UPPER(a.nomor_polisi) = UPPER(b.nomor_polisi)
    LEFT JOIN PO po ON b.id_PO = po.id
    LEFT JOIN terminal ta ON b.terminal_asal = ta.id
    LEFT JOIN terminal tt ON b.terminal_tujuan = tt.id
    LEFT JOIN terminal t_main ON a.terminal_id = t_main.id
  `;
  
  if (req.session.user.role === 'user') {
    pool.query("SELECT nama_terminal FROM terminal WHERE id = ?", [req.session.user.terminal], (err, termResults) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving terminal info");
      }
      const userTerminalName = (termResults.length > 0) ? termResults[0].nama_terminal : "";
      const query = baseQuery + " WHERE a.terminal_id = ? ORDER BY a.id DESC";
      pool.query(query, [req.session.user.terminal], (err, results) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving arrival data");
        }
        res.render("kedatangan", { user: req.session.user, data: results, userTerminalName: userTerminalName });
      });
    });
  } else {
    const query = baseQuery + " ORDER BY a.id DESC";
    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving arrival data");
      }
      res.render("kedatangan", { user: req.session.user, data: results, userTerminalName: "Semua" });
    });
  }
});

// GET /edit-bus-data/:arrivalId
app.get('/edit-bus-data/:arrivalId', isAuthenticated, (req, res) => {
  const arrivalId = req.params.arrivalId;
  // Get the arrival record to retrieve nomor_polisi and capture picture.
  const arrivalQuery = "SELECT * FROM arrival WHERE id = ?";
  pool.query(arrivalQuery, [arrivalId], (err, arrivalResults) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving arrival record.");
    }
    if (arrivalResults.length === 0) {
      return res.send("Arrival record not found.");
    }
    const arrivalRecord = arrivalResults[0];
    const nomorPolisi = arrivalRecord.nomor_polisi;
    // Get the bus record matching the nomor_polisi (case-insensitive)
    const busQuery = "SELECT * FROM bus WHERE UPPER(nomor_polisi) = ?";
    pool.query(busQuery, [nomorPolisi.toUpperCase()], (err, busResults) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving bus record.");
      }
      if (busResults.length === 0) {
        return res.send("Bus record not found.");
      }
      const busRecord = busResults[0];
      // Retrieve list of PO's
      pool.query("SELECT id, nama_PO FROM PO ORDER BY nama_PO ASC", (err, poList) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving PO list.");
        }
        // Retrieve list of Provinsi for cascading dropdowns.
        pool.query("SELECT id, name FROM provinsi ORDER BY name ASC", (err, provinsiList) => {
          if (err) {
            console.error(err);
            return res.send("Error retrieving provinsi list.");
          }
          res.render("editBusData", { 
            user: req.session.user, 
            arrival: arrivalRecord,   // contains picture_path and nomor_polisi
            bus: busRecord,           // contains id_PO, jenis, terminal_asal, terminal_tujuan
            poList: poList, 
            provinsiList: provinsiList 
          });
        });
      });
    });
  });
});

// POST /edit-bus-data/:arrivalId
app.post('/edit-bus-data/:arrivalId', isAuthenticated, (req, res) => {
  const arrivalId = req.params.arrivalId;
  // Destructure form fields from the request body.
  const { poInput, terminalAsal, terminalTujuan, jenis } = req.body;
  
  // Retrieve the arrival record to obtain nomor_polisi.
  pool.query("SELECT nomor_polisi FROM arrival WHERE id = ?", [arrivalId], (err, arrivalResults) => {
    if (err) {
      console.error(err);
      return res.send("Error retrieving arrival record.");
    }
    if (arrivalResults.length === 0) {
      return res.send("Arrival record not found.");
    }
    
    const nomor_polisi = arrivalResults[0].nomor_polisi;
    const poInputValue = poInput.trim();
    const lowerPO = poInputValue.toLowerCase();
    
    // Check if the provided PO exists (case-insensitive)
    pool.query("SELECT id FROM PO WHERE LOWER(nama_PO) = ?", [lowerPO], (err, poResults) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving PO record.");
      }
      
      // Function to update the bus record using a given PO id.
      function updateBusRecord(id_PO) {
        const updateQuery = `
          UPDATE bus 
          SET id_PO = ?, jenis = ?, terminal_asal = ?, terminal_tujuan = ?
          WHERE UPPER(nomor_polisi) = ?
        `;
        pool.query(updateQuery, [id_PO, jenis, terminalAsal, terminalTujuan, nomor_polisi.toUpperCase()], (err, result) => {
          if (err) {
            console.error(err);
            return res.send("Error updating bus record.");
          }
          res.redirect('/kedatangan');
        });
      }
      
      if (poResults.length > 0) {
        // PO exists; use its id.
        const poId = poResults[0].id;
        updateBusRecord(poId);
      } else {
        // PO does not exist; insert a new PO.
        pool.query("INSERT INTO PO (nama_PO) VALUES (?)", [poInputValue], (err, insertResult) => {
          if (err) {
            console.error(err);
            return res.send("Error inserting new PO.");
          }
          const newPOId = insertResult.insertId;
          updateBusRecord(newPOId);
        });
      }
    });
  });
});

// POST /bus/update-license
// Expects: { arrival_id, new_license }
// Checks if new_license exists in the bus table; if not, inserts a new bus record with new_license (other fields as null).
// Then updates the arrival record's nomor_polisi with new_license.
app.post('/bus/update-license', isAuthenticated, (req, res) => {
  const { arrival_id, new_license } = req.body;
  if (!arrival_id || !new_license) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }
  
  // Check if new_license exists in the bus table (case-insensitive)
  pool.query("SELECT * FROM bus WHERE UPPER(nomor_polisi) = ?", [new_license.toUpperCase()], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    
    function updateArrival() {
      pool.query("UPDATE arrival SET nomor_polisi = ? WHERE id = ?", [new_license, arrival_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Error updating arrival record' });
        }
        return res.json({ success: true });
      });
    }
    
    if (results.length === 0) {
      // Insert new bus record if not found.
      pool.query("INSERT INTO bus (nomor_polisi, id_PO, terminal_asal, terminal_tujuan) VALUES (?, NULL, NULL, NULL)", [new_license], (err, insertResult) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Error inserting new bus' });
        }
        updateArrival();
      });
    } else {
      updateArrival();
    }
  });
});

// --------------------------
// WebSocket Server Setup
// --------------------------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Helper: Save image file and return filename
function saveImage(base64Str, licensePlate) {
  const filename = Date.now() + "_" + licensePlate + ".jpg";
  const filePath = path.join(__dirname, "public", "uploads", filename);
  fs.writeFileSync(filePath, Buffer.from(base64Str, "base64"));
  return filename;
}

wss.on('connection', (ws, req) => {
  console.log("New WebSocket connection established");
  
  ws.on('message', (message) => {
    console.log("Received message:", message);
    try {
      const data = JSON.parse(message);
      // Expected structure: { terminal_id, license_text, frame, timestamp }
      const terminal_id = data.terminal_id;
      const license_text = data.license_text.trim().toUpperCase();
      const frame = data.frame;
      const timestamp = data.timestamp; // Format: "%Y-%m-%d %H:%M:%S"
      
      // Split timestamp into tanggal and jam (full time string)
      const [tanggal, jam] = timestamp.split(" ");
      
      // Always insert into the arrival table.
      const tableName = "arrival";
      
      // Check if bus exists
      pool.query("SELECT * FROM bus WHERE UPPER(nomor_polisi) = ?", [license_text], (err, results) => {
        if (err) {
          console.error("Error querying bus:", err);
          return;
        }
        if (results.length === 0) {
          // Insert new bus with license_text; other columns set to NULL.
          pool.query("INSERT INTO bus (nomor_polisi, id_PO, terminal_asal, terminal_tujuan) VALUES (?, NULL, NULL, NULL)", [license_text], (err, insertResult) => {
            if (err) {
              console.error("Error inserting new bus:", err);
              return;
            }
            processRecord(license_text);
          });
        } else {
          processRecord(license_text);
        }
        
        function processRecord(license) {
          // Save image to disk and get filename.
          const filename = saveImage(frame, license);
          const insertQuery = `INSERT INTO ${tableName} (tanggal, jam, nomor_polisi, picture_path, terminal_id) VALUES (?, ?, ?, ?, ?)`;
          pool.query(insertQuery, [tanggal, jam, license, filename, terminal_id], (err, result) => {
            if (err) {
              console.error("Error inserting record into " + tableName + ":", err);
            } else {
              console.log("Record inserted into " + tableName + " for bus", license);
            }
          });
        }
      });
      
    } catch (e) {
      console.error("Error parsing WebSocket message:", e);
    }
  });
  
  ws.on('close', () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
