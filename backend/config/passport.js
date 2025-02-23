const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/HarborUser');
const { google } = require('./googleAuth');
require('./passportX'); // Import X authentication strategy

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Using Mongoose's _id
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: google.clientID,
      clientSecret: google.clientSecret,
      callbackURL: google.callbackURL,
      scope: google.scope
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists with this Google ID or email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          if (user.googleId === profile.id) {
            // Existing Google user, just return
            return done(null, user);
          } else {
            // Email exists but with different auth method
            return done(null, false, { 
              message: 'Email already registered with different authentication method'
            });
          }
        }

        // If not, create new user
        const userId = 'USR_' + Date.now();
        user = new User({
          provider: 'google',
          googleId: profile.id,
          user_id: userId,
          username: profile.displayName,
          email: profile.emails[0].value
        });

        await user.save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);