const axios = require('axios');
const orderRepository = require('../repositories/orderRepository');
const { normalizeCreateOrderPayload } = require('../dtos/orderDto');
const { publishEvent } = require('../../../shared/rabbitmq');
const { getOrderChannel } = require('../config/rabbitmq');

async function resolveFood(foodId) {
  const foodServiceUrl = process.env.FOOD_SERVICE_URL || 'http://localhost:8082';
  try {
    const response = await axios.get(`${foodServiceUrl}/foods/${foodId}`);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Food not found');
    }

    throw error;
  }
}

async function createOrder(body) {
  const payload = normalizeCreateOrderPayload(body);
  const food = await resolveFood(payload.foodId);
  const totalPrice = Number(food.price) * payload.quantity;

  const createdOrder = await orderRepository.createOrder({
    userId: payload.userId,
    foodId: payload.foodId,
    quantity: payload.quantity,
    totalPrice,
    status: 'PENDING',
  });

  await publishEvent(getOrderChannel(), 'ORDER_CREATED', {
    orderId: createdOrder.id,
    userId: createdOrder.userId,
    totalPrice: createdOrder.totalPrice,
  });

  return createdOrder;
}

async function listOrders() {
  return orderRepository.findAllOrders();
}

async function getOrder(id) {
  const order = await orderRepository.findOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
};
