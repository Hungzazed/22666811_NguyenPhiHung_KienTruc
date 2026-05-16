const { createDatabasePool } = require('../../../shared/mysql');

let pool;

async function initializeFoodDatabase() {
  if (pool) {
    return pool;
  }

  pool = await createDatabasePool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'food_service_db',
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS foods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM foods');
  if (rows[0].total === 0) {
    await pool.query(
      'INSERT INTO foods (name, price, description) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      [
        'Chicken Rice', 35000, 'Cơm gà giòn sốt nhà làm',
        'Beef Burger', 45000, 'Burger bò phô mai và khoai chiên',
        'Milk Tea', 25000, 'Trà sữa trân châu đường nâu',
      ]
    );
  }

  return pool;
}

function getFoodPool() {
  if (!pool) {
    throw new Error('Food database has not been initialized');
  }

  return pool;
}

module.exports = {
  initializeFoodDatabase,
  getFoodPool,
};
