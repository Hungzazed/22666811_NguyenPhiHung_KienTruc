const axios = require("axios");
const pool = require("../config/db");

const userService = axios.create({
  baseURL: process.env.USER_SERVICE_URL,
  timeout: 5000,
});

const foodService = axios.create({
  baseURL: process.env.FOOD_SERVICE_URL,
  timeout: 5000,
});

async function validateUser(userId) {
  const res = await userService.get(`/users/${userId}/validate`);
  return res.data;
}

async function fetchFoods() {
  const res = await foodService.get("/foods");
  return Array.isArray(res.data) ? res.data : [];
}

async function createOrder(req, res) {
  const connection = await pool.getConnection();
  try {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "userId and items are required" });
    }

    let user;
    try {
      user = await validateUser(userId);
    } catch (error) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const foods = await fetchFoods();
    const foodMap = new Map(foods.map((food) => [Number(food.id), food]));

    const normalizedItems = [];
    for (const item of items) {
      const foodId = Number(item.foodId);
      const quantity = Number(item.quantity || 0);

      if (Number.isNaN(foodId) || Number.isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid order item" });
      }

      const food = foodMap.get(foodId);
      if (!food) {
        return res.status(400).json({ message: `Food not found: ${foodId}` });
      }

      const unitPrice = Number(food.price);
      const subtotal = unitPrice * quantity;

      normalizedItems.push({
        foodId,
        foodName: food.name,
        unitPrice,
        quantity,
        subtotal,
      });
    }

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'PENDING')",
      [user.id, totalAmount],
    );

    const orderId = orderResult.insertId;

    for (const item of normalizedItems) {
      await connection.query(
        "INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          orderId,
          item.foodId,
          item.foodName,
          item.unitPrice,
          item.quantity,
          item.subtotal,
        ],
      );
    }

    await connection.commit();

    return res.status(201).json({
      message: "Order created",
      id: orderId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      totalAmount,
      status: "PENDING",
      items: normalizedItems,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    return res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
}

async function getOrders(req, res) {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : null;

    const [orders] = userId
      ? await pool.query(
          "SELECT id, user_id, total_amount, status, payment_method, created_at, updated_at FROM orders WHERE user_id = ? ORDER BY id DESC",
          [userId],
        )
      : await pool.query(
          "SELECT id, user_id, total_amount, status, payment_method, created_at, updated_at FROM orders ORDER BY id DESC",
        );

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const [orders] = await pool.query(
      "SELECT id, user_id, total_amount, status, payment_method, created_at, updated_at FROM orders WHERE id = ?",
      [id],
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await pool.query(
      "SELECT food_id, food_name, unit_price, quantity, subtotal FROM order_items WHERE order_id = ?",
      [id],
    );

    return res.json({ ...orders[0], items });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const { status, paymentMethod } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const allowed = ["PENDING", "PAID", "CANCELLED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await pool.query(
      "UPDATE orders SET status = ?, payment_method = ? WHERE id = ?",
      [status, paymentMethod || null, id],
    );

    const [rows] = await pool.query(
      "SELECT id, user_id, total_amount, status, payment_method, created_at, updated_at FROM orders WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order status updated", order: rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
