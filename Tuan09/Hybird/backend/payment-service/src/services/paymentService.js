const { consumeEvents, publishEvent } = require('../../../shared/rabbitmq');
const { getPaymentChannel } = require('../config/rabbitmq');

async function handleOrderCreated(payload) {
  const success = Math.random() > 0.5;

  if (success) {
    console.log(`[Payment Service] Order #${payload.orderId} paid successfully.`);
    await publishEvent(getPaymentChannel(), 'PAYMENT_SUCCESS', {
      orderId: payload.orderId,
      message: `Order #${payload.orderId} payment success`,
    });
    return;
  }

  console.log(`[Payment Service] Order #${payload.orderId} payment failed.`);
  await publishEvent(getPaymentChannel(), 'PAYMENT_FAILED', {
    orderId: payload.orderId,
    reason: 'Random payment failure for demo purpose',
  });
}

async function startPaymentConsumer() {
  const channel = getPaymentChannel();
  await consumeEvents(channel, 'payment-service-queue', ['ORDER_CREATED'], handleOrderCreated);
  console.log('[Payment Service] Consumer started for ORDER_CREATED');
}

module.exports = {
  startPaymentConsumer,
};
