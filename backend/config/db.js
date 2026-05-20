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

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'job_tracker',
  waitForConnections: true,   // queue requests when all 10 connections are busy
  connectionLimit:    10,     // max simultaneous DB connections
  queueLimit:         0,      // 0 = unlimited queue size
  timezone:           'Z',    // store/retrieve dates in UTC
});

// Verify connection works at startup
// If this fails, the whole server exits — better to know immediately than fail silently
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release(); // IMPORTANT: always release connections back to the pool
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('Check your .env file — DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  });

module.exports = pool;
