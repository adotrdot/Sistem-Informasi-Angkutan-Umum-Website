// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Create Express app
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
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Root route redirects to home
app.get('/', (req, res) => {
  res.redirect('/home');
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Validate user from the database
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

// Home page route (requires login)
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { user: req.session.user });
});

// Admin page route (only accessible for admin users)
app.get('/admin', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  // Retrieve all users for the admin view
  pool.query('SELECT * FROM users', (err, users) => {
    if (err) {
      console.error(err);
      return res.send('Error retrieving users');
    }
    res.render('admin', { users, error: null });
  });
});

// Route for creating a new user (admin only)
app.post('/admin/create-user', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.render('admin', { users: [], error: 'All fields are required.' });
  }
  pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.render('admin', { users: [], error: 'Error creating user.' });
    }
    res.redirect('/admin');
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
