const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config(); // Loads variables from .env file

const customerRoutes = require('./routes/customers');

// --- CONFIGURATION ---
const app = express();
// Load the password from the .env file
const APP_PASSWORD = process.env.APP_PASSWORD;
const SESSION_SECRET = 'a-very-strong-and-secret-key-for-your-app'; // Change this

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

// --- SESSION SETUP ---
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 } // Cookie lasts for 1 day
}));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.ATLAS);


// --- AUTHENTICATION MIDDLEWARE ---
// This function remains the same. It checks if the user is logged in.
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
}


// --- SIMPLIFIED AUTHENTICATION ROUTES ---

// Show the login page
app.get('/login', (req, res) => {
  res.render('login', { error: req.session.error });
  req.session.error = null; // Clear error after showing it
});

// Handle password submission
app.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === APP_PASSWORD) {
    req.session.isAuthenticated = true; // Login successful!
    res.redirect('/customers');
  } else {
    req.session.error = 'Invalid password.';
    res.redirect('/login');
  }
});

// The /verify routes are no longer needed and have been removed.

// Handle logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


// --- PROTECTED APPLICATION ROUTES ---

app.get('/', isAuthenticated, (req, res) => res.redirect('/customers'));
app.use('/customers', isAuthenticated, customerRoutes);


// --- SERVER START ---
app.listen(3000, () => console.log('Listening on 3000'));