// routes/jobs.js
// ============================================================
// INTERVIEW EXPLANATION:
// "What is REST and why do you follow it?"
//
// REST = Representational State Transfer. A set of conventions for APIs.
// The key idea: use HTTP verbs + resource URLs to define operations.
//
//   GET    /api/jobs        → Read all (safe, no side effects)
//   POST   /api/jobs        → Create one
//   GET    /api/jobs/:id    → Read one
//   PUT    /api/jobs/:id    → Replace/update one
//   DELETE /api/jobs/:id    → Delete one
//
// "Why do we check job.user_id !== req.user.id?"
// This is authorisation — even though the user is logged in (authentication),
// they should only be able to modify THEIR OWN jobs.
// Without this, user A could delete user B's data just by guessing the job ID.
// This is called an IDOR vulnerability (Insecure Direct Object Reference).
// ============================================================

const express     = require('express');
const router      = express.Router();
const Job         = require('../models/Job');
const { protect } = require('../middleware/auth');

// All job routes require authentication
router.use(protect);

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { status, search, sort } = req.query;

    // Run both queries in PARALLEL with Promise.all
    // Sequential: 100ms + 80ms = 180ms total
    // Parallel:   max(100ms, 80ms) = 100ms total
    const [jobs, stats] = await Promise.all([
      Job.findAll(req.user.id, { status, search, sort }),
      Job.getStats(req.user.id),
    ]);

    res.json({ success: true, count: jobs.length, data: jobs, stats });

  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs.' });
  }
});

// GET /api/jobs/upcoming-interviews
router.get('/upcoming', async (req, res) => {
  try {
    const interviews = await Job.getUpcomingInterviews(req.user.id);
    res.json({ success: true, data: interviews });
  } catch (err) {
    console.error('Get upcoming error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch upcoming interviews.' });
  }
});

// POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const { company, role } = req.body;
    if (!company?.trim() || !role?.trim()) {
      return res.status(400).json({ success: false, message: 'Company name and role are required.' });
    }

    const job = await Job.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: job });

  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ success: false, message: 'Failed to create job.' });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)                          return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.user_id !== req.user.id)   return res.status(403).json({ success: false, message: 'Not authorised to access this job.' });
    res.json({ success: true, data: job });
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch job.' });
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)                          return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.user_id !== req.user.id)   return res.status(403).json({ success: false, message: 'Not authorised to update this job.' });

    const updated = await Job.update(req.params.id, req.body);
    res.json({ success: true, data: updated });

  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ success: false, message: 'Failed to update job.' });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)                          return res.status(404).json({ success: false, message: 'Job not found.' });
    if (job.user_id !== req.user.id)   return res.status(403).json({ success: false, message: 'Not authorised to delete this job.' });

    await Job.delete(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully.' });

  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete job.' });
  }
});

module.exports = router;
