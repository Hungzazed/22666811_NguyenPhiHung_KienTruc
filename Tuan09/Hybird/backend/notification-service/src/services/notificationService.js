const { consumeEvents } = require('../../../shared/rabbitmq');
const { getNotificationChannel } = require('../config/rabbitmq');

async function handlePaymentSuccess(payload) {
  console.log(`Đơn hàng #${payload.orderId} đã thanh toán thành công!`);
}

async function handlePaymentFailed(payload) {
  console.log(`Đơn hàng #${payload.orderId} thanh toán thất bại!`);
}

async function startNotificationConsumer() {
  const channel = getNotificationChannel();

  await consumeEvents(channel, 'notification-service-success-queue', ['PAYMENT_SUCCESS'], handlePaymentSuccess);
  await consumeEvents(channel, 'notification-service-failed-queue', ['PAYMENT_FAILED'], handlePaymentFailed);

  console.log('[Notification Service] Consumers started for payment events');
}

module.exports = {
  startNotificationConsumer,
};
