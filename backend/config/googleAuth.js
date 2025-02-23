// backend/config/googleAuth.js
require('dotenv').config();

module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? 'https://harbor-r.vercel.app/api/auth/google/callback'
      : 'http://localhost:5002/api/auth/google/callback',
    scope: ['profile', 'email']
  }
};