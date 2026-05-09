const axios = require("axios");
const pool = require("../config/db");

const orderService = axios.create({
  baseURL: process.env.ORDER_SERVICE_URL,
  timeout: 5000,
});

function logNotification(userName, orderId) {
  const notifyMessage = `${userName || "User"} da dat don #${orderId} thanh cong`;
  console.log(`[Notification] order=${orderId} | ${notifyMessage}`);
  return notifyMessage;
}

async function createPayment(req, res) {
  try {
    const { orderId, paymentMethod, userName } = req.body;

    if (!orderId || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "orderId and paymentMethod are required" });
    }

    if (!["COD", "BANKING"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ message: "paymentMethod must be COD or BANKING" });
    }

    const orderRes = await orderService.get(`/orders/${orderId}`);
    const order = orderRes.data;

    if (!order || !order.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    await orderService.put(`/orders/${orderId}/status`, {
      status: "PAID",
      paymentMethod,
    });

    const [result] = await pool.query(
      "INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, 'SUCCESS')",
      [
        order.id,
        paymentMethod,
        Number(order.total_amount || order.totalAmount || 0),
      ],
    );

    const notifyMessage = logNotification(userName, order.id);

    return res.status(201).json({
      message: "Payment success",
      payment: {
        id: result.insertId,
        orderId: order.id,
        paymentMethod,
        amount: Number(order.total_amount || order.totalAmount || 0),
        status: "SUCCESS",
      },
      notification: notifyMessage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.response?.data?.message || error.message });
  }
}

module.exports = {
  createPayment,
};
