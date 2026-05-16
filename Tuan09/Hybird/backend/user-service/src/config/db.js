const { createDatabasePool } = require('../../../shared/mysql');

let pool;

async function initializeUserDatabase() {
  if (pool) {
    return pool;
  }

  pool = await createDatabasePool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'user_service_db',
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return pool;
}

function getUserPool() {
  if (!pool) {
    throw new Error('User database has not been initialized');
  }

  return pool;
}

module.exports = {
  initializeUserDatabase,
  getUserPool,
};
