const pool = require("./db");

async function bootstrapDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      payment_method ENUM('COD', 'BANKING') NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      status ENUM('SUCCESS', 'FAILED') NOT NULL DEFAULT 'SUCCESS',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = {
  bootstrapDatabase,
};
