// // backend/routes/authX.js
// const express = require("express");
// const passport = require("passport");
// const router = express.Router();

// // Step 1: Initiate X login
// router.get(
//   "/x",
//   passport.authenticate("x", { scope: ['tweet.read', 'users.read', 'offline.access'] })
// );

// // Step 2: Handle X callback
// router.get(
//   "/x/callback",
//   passport.authenticate("x", { failureRedirect: "/signin" }),
//   (req, res) => {
//     // Successful authentication
//     if (req.user) {
//       res.redirect("http://localhost:5174/dashboard");
//     } else {
//       res.redirect("http://localhost:5174/signin");
//     }
//   }
// );

// module.exports = router;