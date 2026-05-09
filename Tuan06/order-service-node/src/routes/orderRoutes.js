const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
