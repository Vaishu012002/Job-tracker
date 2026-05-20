// server.js
// ============================================================
// INTERVIEW EXPLANATION:
// "What is middleware in Express?"
//
// Middleware = functions that sit between the request and the response.
// Every request flows through middleware in order, like a pipeline:
//
//   Request → cors() → express.json() → route handler → Response
//
// Each middleware receives (req, res, next).
// Calling next() passes control to the next middleware.
// Not calling next() ends the pipeline (useful for auth failures).
//
// Types of middleware:
//   Application-level: app.use(cors())     — runs on every request
//   Router-level:      router.use(protect) — runs on routes in that router
//   Error-handling:    (err, req, res, next) — 4 params = error middleware
// ============================================================

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── GLOBAL MIDDLEWARE ─────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // 10kb limit prevents large payload attacks

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 HANDLER ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.path}` });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────
// 4-parameter signature tells Express this is an error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── START SERVER ──────────────────────────────────────────────
require('./config/db'); // initialise DB connection pool + verify

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
