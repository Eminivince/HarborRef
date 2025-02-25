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
  console.log(`[${new Date().toISOString()}] Checking eligibility for user ID: ${req.user.userId}`);
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log(`[${new Date().toISOString()}] User not found: ${req.user.userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    const referralCount = user.referrals ? user.referrals.length : 0;
    console.log(`[${new Date().toISOString()}] User ${user.user_id} has ${referralCount} referrals`);

    const eligibleTiers = REWARD_TIERS.map((tier) => {
      const isEligible = referralCount >= tier.minReferrals;
      console.log(`[${new Date().toISOString()}] Tier ${tier.minReferrals} referrals: ${isEligible ? 'Eligible' : 'Not eligible'} (${referralCount}/${tier.minReferrals})`);
      return {
        ...tier,
        eligible: isEligible,
        claimed: false, // TODO: Add claim tracking to user model
      };
    });

    console.log(`[${new Date().toISOString()}] Eligibility check completed for user ${user.user_id}`);
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
  console.log(`[${new Date().toISOString()}] Claim attempt - User ID: ${req.user.userId}, Tier Index: ${tierIndex}`);

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log(`[${new Date().toISOString()}] User not found for claim: ${req.user.userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    // Validate tier index
    if (tierIndex < 0 || tierIndex >= REWARD_TIERS.length) {
      console.log(`[${new Date().toISOString()}] Invalid tier index: ${tierIndex}`);
      return res.status(400).json({ error: "Invalid tier index" });
    }

    const tier = REWARD_TIERS[tierIndex];
    const referralCount = user.referrals ? user.referrals.length : 0;

    // Check if user is eligible for this tier
    if (referralCount < tier.minReferrals) {
      console.log(`[${new Date().toISOString()}] User ${user.user_id} not eligible for tier ${tierIndex} (${referralCount}/${tier.minReferrals} referrals)`);
      return res.status(400).json({
        error: "Not eligible for this reward tier",
        required: tier.minReferrals,
        current: referralCount,
      });
    }

    // TODO: Add claim processing logic here
    // For now, just return success
    console.log(`[${new Date().toISOString()}] Processing successful claim for user ${user.user_id} - Tier ${tierIndex} ($${tier.reward})`);
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
