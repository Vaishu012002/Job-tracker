// // models/User.js
// // ============================================================
// // INTERVIEW EXPLANATION:
// // "How do you structure database access in Node.js?"
// //
// // The Model layer is responsible for ALL database operations.
// // Route handlers never write SQL directly — they call model functions.
// // This is the Repository Pattern: separates business logic from data access.
// //
// // Benefits:
// //   1. If you switch from MySQL to PostgreSQL, you only change the models.
// //   2. Easy to unit test — mock the model, not the database.
// //   3. SQL stays in one place, not scattered across route files.
// //
// // "Why use parameterised queries (the ? placeholders)?"
// // NEVER do: `WHERE email = '${email}'` — this allows SQL injection.
// // A hacker could pass email = "' OR 1=1; DROP TABLE users; --"
// // Parameterised queries treat input as data, never as SQL code.
// // ============================================================

// const pool   = require('../config/db');
// const bcrypt = require('bcryptjs');

// const User = {

//   async findByEmail(email) {
//     const [rows] = await pool.query(
//       'SELECT * FROM users WHERE email = ? LIMIT 1',
//       [email]
//     );
//     return rows[0] || null;
//   },

//   async findById(id) {
//     // Never select password in normal lookups — minimise exposure
//     const [rows] = await pool.query(
//       'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
//       [id]
//     );
//     return rows[0] || null;
//   },

//   async create({ name, email, password }) {
//     // INTERVIEW TIP: "What is bcrypt salt?"
//     // Salt is a random string added to the password before hashing.
//     // Even if two users have the same password, their hashes will be different.
//     // Cost factor 10 means 2^10 = 1024 hashing rounds — slow enough to resist brute force.
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const [result] = await pool.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email.toLowerCase().trim(), hash]
//     );
//     // result.insertId is the AUTO_INCREMENT id MySQL assigned to the new row
//     return { id: result.insertId, name, email };
//   },

//   async comparePassword(plainText, hashedPassword) {
//     // bcrypt.compare hashes the plain text with the same salt and compares
//     // Returns true/false — never decrypts (hashing is one-way)
//     return bcrypt.compare(plainText, hashedPassword);
//   },
// };

// module.exports = User;



const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  },

  async create({ name, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email.toLowerCase().trim(), hash]
    );
    return { id: result.rows[0].id, name, email };
  },

  async comparePassword(plainText, hashedPassword) {
    return bcrypt.compare(plainText, hashedPassword);
  },
};

module.exports = User;