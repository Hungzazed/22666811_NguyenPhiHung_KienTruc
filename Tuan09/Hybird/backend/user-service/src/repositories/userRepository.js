const User = require('../entities/User');
const { getUserPool } = require('../config/db');

async function createUser({ username, password }) {
  const pool = getUserPool();
  const [result] = await pool.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );

  return new User({
    id: result.insertId,
    username,
    password,
  });
}

async function findByUsername(username) {
  const pool = getUserPool();
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0] ? new User(rows[0]) : null;
}

async function findById(id) {
  const pool = getUserPool();
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? new User(rows[0]) : null;
}

module.exports = {
  createUser,
  findByUsername,
  findById,
};
