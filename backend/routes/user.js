// backend/routes/user.js

const express = require("express");
const router = express.Router();
const User = require('../models/HarborUser');

/**
 * GET /api/user/me
 * Protected route that returns the currently logged-in user's data.
 */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { passwordHash, ...safeUserData } = req.user.toObject();
  res.json(safeUserData);
});

/**
 * GET /api/user/chart-data
 * Protected route that returns the user's chart data (earnings, stakes, and friends earnings)
 */
router.get("/chart-data", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ user_id: req.user.user_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert Map objects to regular objects for JSON serialization
    const chartData = {
      earnings_over_time: Object.fromEntries(user.earnings_over_time),
      stake_amount_over_time: Object.fromEntries(user.stake_amount_over_time),
      friends_earnings: Object.fromEntries(user.friends_earnings)
    };

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/user/referraltree
 * Protected route that returns the user's referral tree with hierarchical structure
 */
router.get("/referraltree", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Helper function to recursively build the referral tree
    async function buildReferralTree(userId) {
      const user = await User.findOne({ user_id: userId });
      if (!user) return null;

      // Get basic user info
      const userNode = {
        _id: user._id,
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        referrals: []
      };

      // Recursively get referrals
      if (user.referrals && user.referrals.length > 0) {
        const referralPromises = user.referrals.map(referralId => buildReferralTree(referralId));
        const resolvedReferrals = await Promise.all(referralPromises);
        userNode.referrals = resolvedReferrals.filter(ref => ref !== null);
      }

      return userNode;
    }

    // Build the tree starting from the logged-in user
    const referralTree = await buildReferralTree(req.user.user_id);
    if (!referralTree) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json([referralTree]);
  } catch (error) {
    console.error('Error fetching referral tree:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
