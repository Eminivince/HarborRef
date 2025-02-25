const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google']
  },
  googleId: {
    type: String,
    sparse: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  referral_code: {
    type: String,
    unique: true,
    sparse: true
  },
  referred_by: {
    type: String,
    default: null
  },
  referrals: {
    type: [String],
    default: []
  },
  earnings_over_time: {
    type: Map,
    of: Number,
    default: new Map()
  },
  stake_amount_over_time: {
    type: Map,
    of: Number,
    default: new Map()
  },
  friends_earnings: {
    type: Map,
    of: Number,
    default: new Map()
  },
  referral_earnings: {
    type: Number,
    default: 0
  },
  total_ref_rev: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;