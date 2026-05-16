const { createDatabasePool } = require('../../../shared/mysql');

let pool;

async function initializeOrderDatabase() {
  if (pool) {
    return pool;
  }

  pool = await createDatabasePool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'order_service_db',
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      food_id INT NOT NULL,
      quantity INT NOT NULL,
      total_price DECIMAL(12,2) NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return pool;
}

function getOrderPool() {
  if (!pool) {
    throw new Error('Order database has not been initialized');
  }

  return pool;
}

module.exports = {
  initializeOrderDatabase,
  getOrderPool,
};
