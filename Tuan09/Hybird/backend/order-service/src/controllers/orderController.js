const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ message: 'Order created', data: order });
  } catch (error) {
    const status = error.message === 'Food not found' ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
}

async function getOrders(_req, res) {
  try {
    const orders = await orderService.listOrders();
    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.json({ data: order });
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
