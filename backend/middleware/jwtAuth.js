const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log('Received Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Invalid Authorization Header Format');
    return res.status(401).json({ error: 'Access denied. Invalid token format.' });
  }



  
  try {
    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Internal server error' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token Verification Result:', verified);
    
    if (!verified.userId || !verified.user_id) {
      console.log('Token payload missing required fields');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;