// config/db.js
// ============================================================
// INTERVIEW EXPLANATION:
// "Why use a connection pool instead of a single connection?"
//
// A single MySQL connection = one lane on a highway.
// Every request has to wait its turn. Under load, this causes a queue.
//
// A pool = 10 lanes. Multiple requests are handled simultaneously.
// mysql2/promise gives us async/await support (no callback hell).
//
// pool.query() → borrows a connection, runs the query, returns it.
// You never manually manage connections — the pool handles it.
// ============================================================

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'job_tracker',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});