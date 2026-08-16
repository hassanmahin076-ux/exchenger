const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./passport');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// CORS Middleware to allow React frontend requests with credentials/cookies
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://0.0.0.0:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware using SESSION_SECRET
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'exchanger3th_session_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if running HTTPS in production
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Initialize Passport & Restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. Google OAuth Login/Signup Route
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

// 2. Google OAuth Callback Route
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_URL}/auth?error=google_login_failed`,
  }),
  (req, res) => {
    // Successful Google login/signup redirect to dashboard (/home)
    res.redirect(`${CLIENT_URL}/home?login=google_success`);
  }
);

// 3. Current Logged-in User Profile Route
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        google_id: req.user.google_id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        uid: req.user.uid,
        username: req.user.username,
        created_at: req.user.created_at,
        last_login: req.user.last_login,
      },
    });
  }

  return res.status(401).json({
    success: false,
    authenticated: false,
    user: null,
    message: 'User is not authenticated.',
  });
});

// 4. Logout Route
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, error: 'Failed to logout.' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      if (req.accepts('json')) {
        return res.json({ success: true, message: 'Logged out successfully.' });
      }
      res.redirect(`${CLIENT_URL}/auth`);
    });
  });
});

app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, error: 'Failed to logout.' });
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully.' });
    });
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbRes = await db.query('SELECT NOW();');
    res.json({
      status: 'OK',
      database: 'Connected to PostgreSQL (Exchenger)',
      time: dbRes.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express Node.js Auth Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 Google OAuth Client ID loaded: ${process.env.GOOGLE_CLIENT_ID ? 'YES' : 'NO'}`);
});
