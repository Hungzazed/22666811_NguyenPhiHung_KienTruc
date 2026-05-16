const Food = require('../entities/Food');
const { getFoodPool } = require('../config/db');

async function findAllFoods() {
  const pool = getFoodPool();
  const [rows] = await pool.query('SELECT * FROM foods ORDER BY id ASC');
  return rows.map((row) => new Food(row));
}

async function findFoodById(id) {
  const pool = getFoodPool();
  const [rows] = await pool.execute('SELECT * FROM foods WHERE id = ? LIMIT 1', [id]);
  return rows[0] ? new Food(rows[0]) : null;
}

module.exports = {
  findAllFoods,
  findFoodById,
};
