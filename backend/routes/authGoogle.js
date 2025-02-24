// backend/routes/authGoogle.js
const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const router = express.Router();

// Step 1: Kick off Google login
router.get(
  "/google",
  (req, res, next) => {
    // Store referral code in session if present
    const referralCode = req.query.code;
    if (referralCode) {
      req.session.referralCode = referralCode;
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  async (req, res) => {
    // Successful authentication
    if (req.user) {
      try {
        // Check for stored referral code
        const referralCode = req.session.referralCode;
        if (referralCode && !req.user.referred_by) {
          const User = require("../models/HarborUser");

          // Find referring user
          const referrer = await User.findOne({ referral_code: referralCode });
          if (referrer) {
            // Update referred user
            await User.findByIdAndUpdate(req.user._id, {
              referred_by: referrer.user_id,
            });

            // Update referrer's referrals array
            await User.findByIdAndUpdate(referrer._id, {
              $addToSet: { referrals: req.user.user_id },
            });
          }

          // Clear the stored referral code
          delete req.session.referralCode;
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: req.user._id,
            user_id: req.user.user_id,
            email: req.user.email,
            username: req.user.username
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '24h' }
        );

        // Redirect with token
        const redirectUrl = process.env.NODE_ENV === 'production' 
          ? `https://harbor-r.vercel.app/dashboard?token=${token}` 
          : `http://localhost:5173/dashboard?token=${token}`;
        
        res.redirect(redirectUrl);
      } catch (error) {
        console.error("Error processing authentication:", error);
        res.redirect(process.env.NODE_ENV === 'production' ? 'https://harbor-r.vercel.app/signin' : 'http://localhost:5173/signin');
      }
    } else {
      res.redirect(process.env.NODE_ENV === 'production' ? 'https://harbor-r.vercel.app/signin' : 'http://localhost:5173/signin');
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/"); // front-end homepage
  });
});

module.exports = router;
