-- ============================================================
-- schema.sql — Run this ONCE in MySQL Workbench to set up tables
-- HOW TO RUN: File → Open SQL Script → select this file → click ⚡
-- ============================================================

CREATE DATABASE IF NOT EXISTS job_tracker;
USE job_tracker;

-- ── USERS ────────────────────────────────────────────────────
-- INTERVIEW TIP: "Why store password as VARCHAR(255)?"
-- bcrypt always produces a 60-character hash, but VARCHAR(255) is
-- future-proof if we ever switch hashing algorithms.

CREATE TABLE IF NOT EXISTS users (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,   -- UNIQUE = DB-level duplicate prevention
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── JOBS ─────────────────────────────────────────────────────
-- INTERVIEW TIP: "Why use VARCHAR instead of ENUM for status?"
-- VARCHAR is more flexible — adding a new status value to ENUM
-- requires an ALTER TABLE which locks the table. VARCHAR doesn't.

CREATE TABLE IF NOT EXISTS jobs (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  user_id        INT          NOT NULL,
  company        VARCHAR(150) NOT NULL,
  role           VARCHAR(150) NOT NULL,
  status         VARCHAR(20)  NOT NULL DEFAULT 'Applied',
  source         VARCHAR(40)  NOT NULL DEFAULT 'LinkedIn',
  salary         VARCHAR(100),
  location       VARCHAR(150),
  job_url        TEXT,
  notes          TEXT,
  applied_date   DATE,
  interview_date DATE,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- INTERVIEW TIP: "What is a foreign key?"
  -- It's a constraint that enforces referential integrity.
  -- ON DELETE CASCADE means: if a user is deleted, all their jobs are deleted too.
  -- Without this, you'd have "orphan" rows — jobs with no owner.
  CONSTRAINT fk_jobs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- INTERVIEW TIP: "Why add an index on user_id?"
-- Without an index, MySQL does a full table scan (reads every row) to find
-- jobs for a specific user — O(n). With an index, it's O(log n).
-- Always index foreign keys you query by frequently.
CREATE INDEX idx_jobs_user_id ON jobs(user_id);

SELECT 'Database setup complete!' AS result;
SHOW TABLES;
