const { createEventBus } = require('../../../shared/rabbitmq');

let rabbitConnection;
let rabbitChannel;

async function initializePaymentEventBus() {
  if (rabbitChannel) {
    return { rabbitConnection, rabbitChannel };
  }

  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const eventBus = await createEventBus(rabbitUrl);
  rabbitConnection = eventBus.connection;
  rabbitChannel = eventBus.channel;

  return { rabbitConnection, rabbitChannel };
}

function getPaymentChannel() {
  if (!rabbitChannel) {
    throw new Error('RabbitMQ channel has not been initialized');
  }

  return rabbitChannel;
}

module.exports = {
  initializePaymentEventBus,
  getPaymentChannel,
};
