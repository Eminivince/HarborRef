// backend/routes/authLocal.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/HarborUser");
const router = express.Router();

// Register
/**
 * POST /api/auth/register
 * Body: { username, password, email, refCode? }
 */
router.post("/register", async (req, res) => {
  console.log(`[${new Date().toISOString()}] Registration attempt - Email: ${req.body.email}, Username: ${req.body.username}`);
  try {
    const { username, password, email, refCode } = req.body;

    // 1) Check if email is already in use
    console.log(`[${new Date().toISOString()}] Checking for existing email: ${email}`);
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      console.log(`[${new Date().toISOString()}] Registration failed - Email already exists: ${email}`);
      return res.status(400).json({ error: "Email is already in use" });
    }

    // 2) Generate unique user_id
    const userId = "USR_" + Date.now();

    // 3) Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4) Create base user doc
    const newUser = new User({
      provider: "local",
      googleId: null,
      user_id: userId,
      username,
      passwordHash,
      email,
    });

    // 5) If referral code provided, update both referrer and new user
    if (refCode) {
      console.log(`[${new Date().toISOString()}] Processing referral code: ${refCode}`);
      // Attempt to find a user that owns this refCode
      const referrer = await User.findOne({ referral_code: refCode });
      if (referrer) {
        // a) Add new user to referrer's array of referrals
        referrer.referrals.push(userId);
        console.log("refcode:".refCode);

        // b) Optionally increment referrer’s referral_earnings or total_ref_rev
        //    e.g. if you want to award them $10 for each referral
        //    referrer.referral_earnings += 10;
        //    referrer.total_ref_rev += 10;

        await referrer.save();

        // c) Set the new user's referred_by to the code
        newUser.referred_by = refCode;
      } else {
        console.log("Referral code not found:", refCode);
        // It's fine to proceed; user just won't get referred_by
      }
    }

    // 6) Finally save the new user
    await newUser.save();
    console.log(`[${new Date().toISOString()}] User registered successfully - ID: ${userId}`);

    return res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error in /register:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log(`[${new Date().toISOString()}] Login attempt - Username/Email: ${req.body.usernameOrEmail}`);
  try {
    const { usernameOrEmail, password } = req.body;

    console.log(usernameOrEmail, password);

    // Attempt to find by email or username
    let user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      provider: "local",
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log(`[${new Date().toISOString()}] Login failed - Invalid password for user: ${usernameOrEmail}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        user_id: user.user_id,
        email: user.email,
        username: user.username
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log(`[${new Date().toISOString()}] Login successful - User ID: ${user.user_id}`);
    return res.json({
      message: "Logged in successfully",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
