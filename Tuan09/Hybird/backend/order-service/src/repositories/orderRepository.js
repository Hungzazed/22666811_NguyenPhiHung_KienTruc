const Order = require('../entities/Order');
const { getOrderPool } = require('../config/db');

async function createOrder({ userId, foodId, quantity, totalPrice, status }) {
  const pool = getOrderPool();
  const [result] = await pool.execute(
    'INSERT INTO orders (user_id, food_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
    [userId, foodId, quantity, totalPrice, status]
  );

  return new Order({
    id: result.insertId,
    userId,
    foodId,
    quantity,
    totalPrice,
    status,
  });
}

async function findAllOrders() {
  const pool = getOrderPool();
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
  return rows.map((row) => new Order({
    id: row.id,
    userId: row.user_id,
    foodId: row.food_id,
    quantity: row.quantity,
    totalPrice: Number(row.total_price),
    status: row.status,
  }));
}

async function findOrderById(id) {
  const pool = getOrderPool();
  const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) {
    return null;
  }

  const row = rows[0];
  return new Order({
    id: row.id,
    userId: row.user_id,
    foodId: row.food_id,
    quantity: row.quantity,
    totalPrice: Number(row.total_price),
    status: row.status,
  });
}

module.exports = {
  createOrder,
  findAllOrders,
  findOrderById,
};
