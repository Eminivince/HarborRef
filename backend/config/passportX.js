// const passport = require('passport');
// const XStrategy = require('@superfaceai/passport-twitter-oauth2').Strategy;
// const User = require('../models/HarborUser');
// const { x } = require('./xAuth');

// // X OAuth Strategy
// passport.use(
//   new XStrategy(
//     {
//       clientID: x.clientID,
//       clientSecret: x.clientSecret,
//       callbackURL: x.callbackURL,
//       scope: x.scope
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user exists with this X ID or email
//         let user = await User.findOne({
//           $or: [
//             { xId: profile.id },
//             { email: profile.emails[0].value }
//           ]
//         });

//         if (user) {
//           if (user.xId === profile.id) {
//             // Existing X user, just return
//             return done(null, user);
//           } else {
//             // Email exists but with different auth method
//             return done(null, false, { 
//               message: 'Email already registered with different authentication method'
//             });
//           }
//         }

//         // If not, create new user
//         const userId = 'USR_' + Date.now();
//         user = new User({
//           provider: 'x',
//           xId: profile.id,
//           user_id: userId,
//           username: profile.displayName,
//           email: profile.emails[0].value
//         });

//         await user.save();
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );