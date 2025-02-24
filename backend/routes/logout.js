// backend/routes/logout.js
const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
  // For JWT-based authentication, we don't need to do anything server-side
  // The client should remove the token from their storage
  res.json({
    message: 'Logged out successfully',
    instructions: 'Please remove the JWT token from your client storage'
  });
});

module.exports = router;