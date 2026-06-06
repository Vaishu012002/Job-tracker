-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
  id             SERIAL PRIMARY KEY,
  user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company        VARCHAR(150) NOT NULL,
  role           VARCHAR(150) NOT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'Applied',
  source         VARCHAR(40) NOT NULL DEFAULT 'LinkedIn',
  salary         VARCHAR(100),
  location       VARCHAR(150),
  job_url        TEXT,
  notes          TEXT,
  applied_date   DATE,
  interview_date DATE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);