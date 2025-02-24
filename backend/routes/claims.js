const express = require("express");
const router = express.Router();
const User = require("../models/HarborUser");
const verifyToken = require("../middleware/jwtAuth");

// Define reward tiers based on number of referrals
const REWARD_TIERS = [
  { minReferrals: 5, reward: 50 }, // 5 referrals = $50
  { minReferrals: 10, reward: 150 }, // 10 referrals = $150
  { minReferrals: 20, reward: 400 }, // 20 referrals = $400
  { minReferrals: 50, reward: 1200 }, // 50 referrals = $1200
];

// GET /api/claims/eligibility
// Check user's eligibility for rewards based on their referral count
router.get("/eligibility", verifyToken, async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user.userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const referralCount = user.referrals ? user.referrals.length : 0;
    const eligibleTiers = REWARD_TIERS.map((tier) => ({
      ...tier,
      eligible: referralCount >= tier.minReferrals,
      claimed: false, // TODO: Add claim tracking to user model
    }));

    res.json({
      referralCount,
      eligibleTiers,
    });
  } catch (error) {
    console.error("Error checking claim eligibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/claims/claim
// Process a reward claim for an eligible tier
router.post("/claim", verifyToken, async (req, res) => {
  const { tierIndex } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate tier index
    if (tierIndex < 0 || tierIndex >= REWARD_TIERS.length) {
      return res.status(400).json({ error: "Invalid tier index" });
    }

    const tier = REWARD_TIERS[tierIndex];
    const referralCount = user.referrals ? user.referrals.length : 0;

    // Check if user is eligible for this tier
    if (referralCount < tier.minReferrals) {
      return res.status(400).json({
        error: "Not eligible for this reward tier",
        required: tier.minReferrals,
        current: referralCount,
      });
    }

    // TODO: Add claim processing logic here
    // For now, just return success
    res.json({
      success: true,
      message: "Claim processed successfully",
      reward: tier.reward,
    });
  } catch (error) {
    console.error("Error processing claim:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
