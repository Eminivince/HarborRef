const express = require("express");
const router = express.Router();
const User = require("../models/HarborUser");

// Define reward tiers based on number of referrals
const REWARD_TIERS = [
  { minReferrals: 5, reward: 50 },  // 5 referrals = $50
  { minReferrals: 10, reward: 150 }, // 10 referrals = $150
  { minReferrals: 20, reward: 400 }, // 20 referrals = $400
  { minReferrals: 50, reward: 1200 } // 50 referrals = $1200
];

// GET /api/claims/eligibility
// Check user's eligibility for rewards based on their referral count
router.get("/eligibility", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const referralCount = user.referrals.length;
    const eligibleTiers = REWARD_TIERS.map(tier => ({
      ...tier,
      eligible: referralCount >= tier.minReferrals,
      claimed: false // TODO: Add claim tracking to user model
    }));

    res.json({
      referralCount,
      eligibleTiers
    });
  } catch (error) {
    console.error("Error checking claim eligibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/claims/claim
// Process a reward claim for an eligible tier
router.post("/claim", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { tierIndex } = req.body;
  if (tierIndex === undefined || tierIndex < 0 || tierIndex >= REWARD_TIERS.length) {
    return res.status(400).json({ error: "Invalid tier index" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const selectedTier = REWARD_TIERS[tierIndex];
    const referralCount = user.referrals.length;

    // Check if user has enough referrals for this tier
    if (referralCount < selectedTier.minReferrals) {
      return res.status(400).json({
        error: "Not enough referrals for this tier",
        required: selectedTier.minReferrals,
        current: referralCount
      });
    }

    // Update user's earnings
    const claimDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentEarnings = user.earnings_over_time.get(claimDate) || 0;
    user.earnings_over_time.set(claimDate, currentEarnings + selectedTier.reward);
    
    // Update total referral revenue
    user.total_ref_rev += selectedTier.reward;

    await user.save();

    res.json({
      success: true,
      claimed: selectedTier.reward,
      newTotal: user.total_ref_rev
    });

  } catch (error) {
    console.error("Error processing claim:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;