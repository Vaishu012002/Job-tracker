# 🎯 Job Application Tracker

Full-stack MERN-style app with MySQL. Built to showcase real-world development skills.

**Stack:** Node.js · Express · MySQL · React (Vite) · JWT Auth · Recharts

---

## Setup

### 1. Run the schema in MySQL Workbench
File → Open SQL Script → `backend/config/schema.sql` → click ⚡

### 2. Configure environment
```bash
cd backend
cp .env.example .env
# Fill in DB_PASSWORD and JWT_SECRET
```

### 3. Install and run

Terminal 1 (backend):
```bash
cd backend && npm install && npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:5173

---

## Interview Q&A — Study These!

**Q: Why MySQL over MongoDB for this project?**
A: Job applications have a clear relational structure — each job belongs to one user.
MySQL enforces this with a foreign key constraint (ON DELETE CASCADE).
With MongoDB, you'd have to manually clean up orphaned documents.

**Q: What is SQL injection and how do you prevent it?**
A: SQL injection is when an attacker sends malicious SQL as input.
Example: email = `' OR 1=1; DROP TABLE users; --`
Prevention: always use parameterised queries with `?` placeholders.
mysql2 sends the parameters separately — they're never concatenated into the SQL string.

**Q: What is a connection pool?**
A: Instead of opening/closing a DB connection per request (expensive),
a pool maintains N open connections and lends them out.
After a query, the connection is returned to the pool, not closed.

**Q: How does JWT auth work?**
A: Login → server creates token: `jwt.sign({ id: 42 }, SECRET, { expiresIn: '30d' })`
Client stores token in localStorage, sends it as `Authorization: Bearer <token>`
Server verifies with `jwt.verify(token, SECRET)` — checks signature + expiry.
Stateless: no session stored in DB.

**Q: What is the difference between 401 and 403?**
A: 401 Unauthorised = not logged in (no token / bad token).
403 Forbidden = logged in but not allowed to do this specific thing.

**Q: Why use a custom hook (useJobs)?**
A: Separates data-fetching logic from the component.
The component only handles rendering.
The hook handles loading states, error states, and API calls.
Reusable — any component can call useJobs().

**Q: What is prop drilling and how does Context solve it?**
A: Prop drilling = passing props through many layers just to reach a deep child.
Context = a global store any component can subscribe to with useContext().
Used for auth state (user, login, logout) — needed in Navbar, PrivateRoute, pages.

**Q: What is the difference between useCallback and useMemo?**
A: useCallback memoises a function reference.
useMemo memoises a computed value.
Both prevent unnecessary recalculation when component re-renders.

**Q: What is IDOR and how do you prevent it?**
A: Insecure Direct Object Reference — accessing resources by guessing IDs.
Example: GET /api/jobs/999 where 999 belongs to another user.
Fix: always check `job.user_id === req.user.id` after fetching by ID.
