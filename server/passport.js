const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
require('dotenv').config();

const googleClientId = process.env.GOOGLE_CLIENT_ID || 'your_google_client_id';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret';
const serverPort = process.env.PORT || 5000;
const callbackURL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${serverPort}/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
        const name = profile.displayName || profile.name?.givenName || 'Google User';
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        if (!email && !googleId) {
          return done(new Error('No email or Google ID provided by Google profile'), null);
        }

        // 1. Check if user exists by google_id or email
        const existingUserRes = await db.query(
          `SELECT * FROM users WHERE (google_id IS NOT NULL AND google_id = $1) OR (email IS NOT NULL AND LOWER(email) = $2);`,
          [googleId, email]
        );

        let user = null;

        if (existingUserRes.rows.length > 0) {
          // Existing user -> Update last_login, name, avatar, google_id
          user = existingUserRes.rows[0];

          const updateRes = await db.query(
            `UPDATE users 
             SET google_id = COALESCE(google_id, $1),
                 name = COALESCE($2, name),
                 avatar = COALESCE($3, avatar),
                 last_login = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING *;`,
            [googleId, name, avatar, user.id]
          );

          user = updateRes.rows[0];
          console.log(`Existing user logged in via Google: ${user.email} (ID: ${user.id})`);
        } else {
          // New user -> Automatically create account
          const randomUid = Math.floor(100000000 + Math.random() * 900000000).toString();
          const username = name.replace(/\s+/g, '_').toLowerCase();

          const insertRes = await db.query(
            `INSERT INTO users (google_id, name, email, avatar, uid, username, auth_provider, created_at, last_login)
             VALUES ($1, $2, $3, $4, $5, $6, 'google', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *;`,
            [googleId, name, email, avatar, randomUid, username]
          );

          user = insertRes.rows[0];

          // Initialize default USDT balance record for new user
          try {
            await db.query(
              `INSERT INTO balances (user_id, total_usdt, available_usdt, spot_usdt, futures_usdt, staked_usdt)
               VALUES ($1, 0.0, 0.0, 0.0, 0.0, 0.0)
               ON CONFLICT (user_id) DO NOTHING;`,
              [user.id]
            );
          } catch (balErr) {
            console.warn('Balance creation warning:', balErr.message);
          }

          console.log(`New user created via Google: ${user.email} (ID: ${user.id}, UID: ${user.uid})`);
        }

        return done(null, user);
      } catch (err) {
        console.error('Error during Google Strategy authentication:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize user ID into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session by ID
passport.deserializeUser(async (id, done) => {
  try {
    const res = await db.query('SELECT id, google_id, name, email, avatar, uid, username, created_at, last_login FROM users WHERE id = $1;', [id]);
    if (res.rows.length === 0) {
      return done(null, false);
    }
    done(null, res.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
