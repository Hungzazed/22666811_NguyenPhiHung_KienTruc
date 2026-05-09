const pool = require("./db");

async function bootstrapDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_amount DECIMAL(12,2) NOT NULL,
      status ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
      payment_method ENUM('COD', 'BANKING') NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      food_id INT NOT NULL,
      food_name VARCHAR(120) NOT NULL,
      unit_price DECIMAL(12,2) NOT NULL,
      quantity INT NOT NULL,
      subtotal DECIMAL(12,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
}

module.exports = {
  bootstrapDatabase,
};
