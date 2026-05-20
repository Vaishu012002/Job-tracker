// models/Job.js
// ============================================================
// INTERVIEW EXPLANATION:
// "Walk me through how you handle dynamic SQL filters."
//
// The challenge: a user might filter by status, search by keyword,
// and sort — all optional. You can't hardcode every combination.
//
// Solution: Build the WHERE clause dynamically using arrays.
//   conditions = ['user_id = ?', 'status = ?', '(company LIKE ? OR role LIKE ?)']
//   params     = [42,            'Applied',     '%google%', '%google%']
// Then join conditions with AND and spread params into pool.query().
//
// This is safe because we're still using ? placeholders throughout.
//
// "What is GROUP BY used for?"
// GROUP BY collapses rows with the same value into one row.
// SELECT status, COUNT(*) FROM jobs GROUP BY status
// gives you: [{ status:'Applied', count:5 }, { status:'Interview', count:2 }]
// Useful for dashboard stats without fetching all rows.
// ============================================================

const pool = require('../config/db');

const Job = {

  // Get all jobs for a user with optional filtering, search, and sorting
  async findAll(userId, { status, search, sort } = {}) {
    const conditions = ['user_id = ?'];
    const params     = [userId];

    if (status && status !== 'All') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search && search.trim()) {
      // LOWER() + LIKE = case-insensitive search
      conditions.push('(LOWER(company) LIKE ? OR LOWER(role) LIKE ?)');
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term); // push twice — once for company, once for role
    }

    const sortOptions = {
      newest:  'created_at DESC',
      oldest:  'created_at ASC',
      company: 'company ASC',
      role:    'role ASC',
    };
    const orderBy = sortOptions[sort] || 'created_at DESC';

    const [rows] = await pool.query(
      `SELECT * FROM jobs WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`,
      params
    );
    return rows;
  },

  // Get counts per status for the dashboard chart
  // Returns: [{ status: 'Applied', count: 5 }, { status: 'Interview', count: 2 }, ...]
  async getStats(userId) {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM jobs
       WHERE user_id = ?
       GROUP BY status
       ORDER BY FIELD(status, 'Wishlist','Applied','Interview','Offer','Rejected')`,
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async create(userId, data) {
    const {
      company, role,
      status        = 'Applied',
      source        = 'LinkedIn',
      salary        = null,
      location      = null,
      job_url       = null,
      notes         = null,
      applied_date  = new Date().toISOString().split('T')[0],
      interview_date = null,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO jobs
         (user_id, company, role, status, source, salary, location, job_url, notes, applied_date, interview_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, company, role, status, source, salary, location, job_url, notes, applied_date, interview_date]
    );
    return Job.findById(result.insertId);
  },

  async update(id, data) {
    // Whitelist allowed fields — never do UPDATE SET ? with raw user input
    const ALLOWED = ['company','role','status','source','salary','location','job_url','notes','applied_date','interview_date'];
    const updates = {};
    ALLOWED.forEach(field => {
      if (data[field] !== undefined) {
        updates[field] = data[field] === '' ? null : data[field];
      }
    });

    if (Object.keys(updates).length === 0) return Job.findById(id);

    // mysql2 expands an object as SET col=val, col=val, ...
    await pool.query('UPDATE jobs SET ? WHERE id = ?', [updates, id]);
    return Job.findById(id);
  },

  async delete(id) {
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return true;
  },

  // Get upcoming interviews for the logged-in user (next 7 days)
  async getUpcomingInterviews(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM jobs
       WHERE user_id = ?
         AND interview_date >= CURDATE()
         AND interview_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
       ORDER BY interview_date ASC`,
      [userId]
    );
    return rows;
  },
};

module.exports = Job;
