const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(passport.initialize());

// ==========================================
// 1. GOOGLE STRATEGY
// ==========================================
passport.use(new GoogleStrategy({
    clientID: "510547982696-9ffgl7thp7gq30v91ng9loqp7eqt8ial.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const user = { email: profile.emails[0].value, username: profile.displayName };
    return done(null, user);
  }
));

// ==========================================
// 2. FACEBOOK STRATEGY
// ==========================================
passport.use(new FacebookStrategy({
    clientID: "PASTE_YOUR_FACEBOOK_APP_ID_HERE", // Update this when Facebook verification finishes!
    clientSecret: "PASTE_YOUR_FACEBOOK_APP_SECRET_HERE", // Update this when Facebook verification finishes!
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
    const user = { 
      email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`, 
      username: profile.displayName 
    };
    return done(null, user);
  }
));

// ==========================================
// 3. AUTHENTICATION ROUTE ENTRY POINTS
// ==========================================
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// ==========================================
// 4. AUTHENTICATION CALLBACK HANDSHAKES
// ==========================================
app.get('/api/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173' }),
  function(req, res) {
    const token = jwt.sign({ user: req.user }, 'FinQuestMageSuperSecureTokenKey_987!', { expiresIn: '2h' });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: 'http://localhost:5173' }),
  function(req, res) {
    const token = jwt.sign({ user: req.user }, 'FinQuestMageSuperSecureTokenKey_987!', { expiresIn: '2h' });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

app.get('/', (req, res) => {
  res.send('FinQuest Core Backend API Engine is Online!');
});

app.listen(5000, () => console.log('Server engine running on port 5000'));