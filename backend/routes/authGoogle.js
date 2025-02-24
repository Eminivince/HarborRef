// backend/routes/authGoogle.js
const express = require("express");
const passport = require("passport");
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
        res.redirect("http://localhost:5173/dashboard");
      } catch (error) {
        console.error("Error processing referral:", error);
        res.redirect("http://localhost:5173/dashboard");
      }
    } else {
      res.redirect("http://localhost:5173/signin");
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/"); // front-end homepage
  });
});

module.exports = router;
