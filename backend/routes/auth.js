// routes/auth.js
// ============================================================
// INTERVIEW EXPLANATION:
// "What HTTP status codes do you use and why?"
//
//   200 OK         → successful GET, PUT
//   201 Created    → successful POST that created a resource
//   400 Bad Request → client sent invalid data (validation failed)
//   401 Unauthorised → not logged in / bad token
//   403 Forbidden   → logged in but not allowed to do this
//   404 Not Found   → resource doesn't exist
//   500 Server Error → unexpected crash on our side
//
// Using correct status codes is important because:
//   - Frontend can handle errors generically based on status
//   - APIs become predictable and self-documenting
//   - Monitoring tools can alert on 5xx spikes
// ============================================================

const express         = require('express');
const router          = express.Router();
const jwt             = require('jsonwebtoken');
const User            = require('../models/User');
const { protect }     = require('../middleware/auth');

const signToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

// Helper to send a clean user response (never expose password hash)
const sendUserResponse = (res, status, user) => {
  res.status(status).json({
    success: true,
    data: {
      id:    user.id,
      name:  user.name,
      email: user.email,
      token: signToken(user.id),
    },
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // Check for existing account
    if (await User.findByEmail(email)) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name: name.trim(), email, password });
    sendUserResponse(res, 201, user);

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      // INTERVIEW TIP: Never say "wrong password" vs "wrong email" separately.
      // That helps attackers know which part is correct (user enumeration attack).
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    sendUserResponse(res, 200, user);

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

// GET /api/auth/me — get currently logged-in user's profile
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
