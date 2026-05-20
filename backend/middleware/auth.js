// middleware/auth.js
// ============================================================
// INTERVIEW EXPLANATION:
// "How does JWT authentication work?"
//
// JWT = JSON Web Token. It's a stateless authentication mechanism.
//
// Flow:
//   1. User logs in → server creates a token: jwt.sign({ id: 42 }, SECRET)
//   2. Token is sent to the client (stored in localStorage)
//   3. Client sends token in every request header:
//      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//   4. Server verifies: jwt.verify(token, SECRET)
//      - Checks the signature hasn't been tampered with
//      - Checks the token hasn't expired
//      - Decodes the payload: { id: 42 }
//
// "Why is JWT stateless?"
// The server doesn't store sessions in a database.
// All the info needed (user id, expiry) is inside the token itself.
// This scales horizontally — any server can verify any token.
//
// "What's the difference between Authentication and Authorisation?"
// Authentication = proving who you are (JWT verification)
// Authorisation  = checking what you're allowed to do (job.user_id === req.user.id)
// ============================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Check header exists and starts with 'Bearer '
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in.',
    });
  }

  try {
    const token   = authHeader.split(' ')[1]; // everything after "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: 42, iat: 1234567890, exp: 9876543210 }
    // iat = issued at, exp = expiry — both are Unix timestamps

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user; // attach user to request — available in all downstream handlers
    next();          // pass control to the route handler

  } catch (err) {
    // jwt.verify throws:
    //   JsonWebTokenError   → token was tampered with
    //   TokenExpiredError   → token is past its expiry date
    const message = err.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid token. Please log in again.';

    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
