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

// --- Basic Routes --- //

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
  pool.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.render('login', { error: 'An error occurred. Please try again.' });
      }
      if (results.length > 0) {
        req.session.user = results[0];
        return res.redirect('/home');
      }
      res.render('login', { error: 'Invalid credentials. Please try again.' });
    }
  );
});

// GET /home (requires login)
// For non-admin users without a linked terminal, load provinsi list for the forced terminal update modal.
app.get('/home', isAuthenticated, (req, res) => {
  if (req.session.user.role === 'user' && !req.session.user.terminal) {
    pool.query('SELECT * FROM provinsi ORDER BY name', (err, provinsiList) => {
      if (err) {
        console.error(err);
        return res.render('home', { user: req.session.user, provinsiList: [] });
      }
      res.render('home', { user: req.session.user, provinsiList });
    });
  } else {
    res.render('home', { user: req.session.user, provinsiList: [] });
  }
});

// GET /admin (requires login, admin only)
app.get('/admin', isAuthenticated, (req, res) => {
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
      res.render('admin', { users, error: null, provinsiList });
    });
  });
});

// POST /admin/create-user (admin only)
// New user creation: only username, password, and role are collected.
// For role "user", the terminal field is set to NULL so the user can update it later.
app.post('/admin/create-user', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') return res.status(403).send('Forbidden');
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.render('admin', { users: [], error: 'Username, password, and role are required.', provinsiList: [] });
  }
  pool.query(
    'INSERT INTO users (username, password, role, terminal) VALUES (?, ?, ?, ?)',
    [username, password, role, null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.render('admin', { users: [], error: 'Error creating user.', provinsiList: [] });
      }
      res.redirect('/admin');
    }
  );
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// GET /get-kabupaten (accessible to any authenticated user)
// Returns all kabupaten for a given provinsi_id.
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

// GET /get-terminal (accessible to any authenticated user)
// Returns all terminals for a given kabupaten_id.
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
// Updates the user's terminal with the provided terminal ID.
app.post('/user/update-terminal', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'user') {
    return res.status(403).send('Forbidden');
  }
  const { terminal } = req.body;
  if (!terminal) {
    return res.status(400).send('Terminal is required.');
  }
  pool.query(
    'UPDATE users SET terminal = ? WHERE id = ?',
    [terminal, req.session.user.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating terminal.');
      }
      req.session.user.terminal = terminal;
      res.send('OK');
    }
  );
});

// --- New Pages and API Endpoints --- //

// GET /kedatangan (Data Kedatangan)
app.get('/kedatangan', isAuthenticated, (req, res) => {
  // For non-admin users without a linked terminal, redirect to /home.
  if (req.session.user.role === 'user' && (!req.session.user.terminal || req.session.user.terminal === "")) {
    return res.redirect('/home');
  }
  
  if (req.session.user.role === 'user') {
    // Get the user's terminal name
    pool.query("SELECT nama_terminal FROM terminal WHERE id = ?", [req.session.user.terminal], (err, termResults) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving terminal info");
      }
      let userTerminalName = (termResults.length > 0) ? termResults[0].nama_terminal : "";
      // Retrieve arrival data for this terminal, formatting the date on the SQL side.
      const query = `
        SELECT 
          DATE_FORMAT(tanggal, '%d-%m-%Y') AS tanggal, 
          jam, 
          nomor_polisi,
          '' AS nama_PO,
          '' AS asal,
          '' AS tujuan
        FROM arrival
        WHERE terminal_id = ?
      `;
      pool.query(query, [req.session.user.terminal], (err, results) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving arrival data");
        }
        res.render("kedatangan", { user: req.session.user, data: results, userTerminalName: userTerminalName });
      });
    });
  } else {
    // Admin sees all arrival data.
    const query = `
      SELECT 
        DATE_FORMAT(tanggal, '%d-%m-%Y') AS tanggal, 
        jam, 
        nomor_polisi,
        '' AS nama_PO,
        '' AS asal,
        '' AS tujuan
      FROM arrival
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving arrival data");
      }
      res.render("kedatangan", { user: req.session.user, data: results, userTerminalName: "All" });
    });
  }
});

// GET /keberangkatan (Data Keberangkatan)
app.get('/keberangkatan', isAuthenticated, (req, res) => {
  // For non-admin users without a linked terminal, redirect to /home.
  if (req.session.user.role === 'user' && (!req.session.user.terminal || req.session.user.terminal === "")) {
    return res.redirect('/home');
  }
  
  if (req.session.user.role === 'user') {
    // Get the user's terminal name.
    pool.query("SELECT nama_terminal FROM terminal WHERE id = ?", [req.session.user.terminal], (err, termResults) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving terminal info");
      }
      let userTerminalName = (termResults.length > 0) ? termResults[0].nama_terminal : "";
      // Retrieve departure data for this terminal with formatted date.
      const query = `
        SELECT 
          DATE_FORMAT(tanggal, '%d-%m-%Y') AS tanggal, 
          jam, 
          nomor_polisi,
          '' AS nama_PO,
          '' AS asal,
          '' AS tujuan
        FROM departure
        WHERE terminal_id = ?
      `;
      pool.query(query, [req.session.user.terminal], (err, results) => {
        if (err) {
          console.error(err);
          return res.send("Error retrieving departure data");
        }
        res.render("keberangkatan", { user: req.session.user, data: results, userTerminalName: userTerminalName });
      });
    });
  } else {
    // Admin sees all departure data.
    const query = `
      SELECT 
        DATE_FORMAT(tanggal, '%d-%m-%Y') AS tanggal, 
        jam, 
        nomor_polisi,
        '' AS nama_PO,
        '' AS asal,
        '' AS tujuan
      FROM departure
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.send("Error retrieving departure data");
      }
      res.render("keberangkatan", { user: req.session.user, data: results, userTerminalName: "All" });
    });
  }
});

// API endpoint for realtime polling (optional)
// GET /api/arrival
app.get('/api/arrival', isAuthenticated, (req, res) => {
  if (req.session.user.role === 'user') {
    if (!req.session.user.terminal) return res.json([]);
    pool.query("SELECT * FROM arrival WHERE terminal_id = ?", [req.session.user.terminal], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving arrival data");
      }
      res.json(results);
    });
  } else {
    pool.query("SELECT * FROM arrival", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving arrival data");
      }
      res.json(results);
    });
  }
});

// GET /api/departure
app.get('/api/departure', isAuthenticated, (req, res) => {
  if (req.session.user.role === 'user') {
    if (!req.session.user.terminal) return res.json([]);
    pool.query("SELECT * FROM departure WHERE terminal_id = ?", [req.session.user.terminal], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving departure data");
      }
      res.json(results);
    });
  } else {
    pool.query("SELECT * FROM departure", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error retrieving departure data");
      }
      res.json(results);
    });
  }
});

// --- WebSocket Handling --- //
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
      // Expected structure:
      // { terminal_id, is_departure, license_text, frame, timestamp }
      const terminal_id = data.terminal_id;
      const is_departure = data.is_departure;
      const license_text = data.license_text.trim().toUpperCase();
      const frame = data.frame;
      const timestamp = data.timestamp; // "%Y-%m-%d %H:%M:%S"
      
      // Split timestamp into tanggal and jam (HH:MM)
      const [tanggal, timePart] = timestamp.split(" ");
      const jam = timePart.substring(0,5);
      
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
          // Save image to disk and get filename
          const filename = saveImage(frame, license);
          const tableName = is_departure ? "departure" : "arrival";
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
