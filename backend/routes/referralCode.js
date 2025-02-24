// backend/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/HarborUser");

// POST /api/user/referral
// Generates a unique referral code if user doesn't have one already
router.post("/referral", async (req, res) => {
  console.log(
    `[${new Date().toISOString()}] Referral code generation attempt - User ID: ${
      req.user?._id
    }`
  );
  if (!req.user) {
    console.log(
      `[${new Date().toISOString()}] Unauthorized referral code generation attempt`
    );
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userDoc = await User.findById(req.user._id);
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    // If userDoc already has a referral_code, return it
    if (userDoc.referral_code) {
      console.log(
        `[${new Date().toISOString()}] Existing referral code found for user ${
          req.user._id
        }: ${userDoc.referral_code}`
      );
      return res.json({ referral_code: userDoc.referral_code });
    }

    // Otherwise, generate a new code
    // e.g. a random string or a short unique ID
    const uniqueCode =
      "ref_" + Math.random().toString(36).slice(2, 8).toUpperCase();
    userDoc.referral_code = uniqueCode;
    await userDoc.save();

    console.log(
      `[${new Date().toISOString()}] New referral code generated for user ${
        req.user._id
      }: ${uniqueCode}`
    );
    return res.json({ referral_code: userDoc.referral_code });
  } catch (error) {
    console.error("Error generating referral code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/user/referrals
// Returns the list of users that the current logged-in user has referred.
router.get("/referrallist", async (req, res) => {
  console.log(
    `[${new Date().toISOString()}] Referral list request - User ID: ${
      req.user?.userId
    }`
  );
  if (!req.user) {
    console.log(
      `[${new Date().toISOString()}] Unauthorized referral list request`
    );
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 1) Find the logged-in user's document
    const userDoc = await User.findById(req.user?.userId).select("referrals");
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    // userDoc.referrals is an array of user_ids (e.g. ["USR002", "USR003"])
    // 2) Find all users whose user_id is in userDoc.referrals
    const referredUsers = await User.find({
      user_id: { $in: userDoc.referrals },
    }).select("-passwordHash -password -__v");
    // ^ exclude sensitive fields

    // Return the list
    console.log(
      `[${new Date().toISOString()}] Retrieved ${
        referredUsers.length
      } referrals for user ${req.user._id}`
    );
    return res.json(referredUsers);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

module.exports = router;
