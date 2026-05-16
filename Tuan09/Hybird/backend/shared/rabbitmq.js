const amqp = require('amqplib');

const EXCHANGE_NAME = 'food_delivery_events';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createEventBus(rabbitUrl) {
  let lastError;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      const connection = await amqp.connect(rabbitUrl);
      const channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

      return { connection, channel };
    } catch (error) {
      lastError = error;
      await delay(2000);
    }
  }

  throw lastError;
}

async function publishEvent(channel, eventType, payload) {
  const body = Buffer.from(
    JSON.stringify({
      eventType,
      payload,
      occurredAt: new Date().toISOString(),
    })
  );

  channel.publish(EXCHANGE_NAME, eventType, body, {
    contentType: 'application/json',
    persistent: true,
  });
}

async function consumeEvents(channel, queueName, eventTypes, handler) {
  const queue = await channel.assertQueue(queueName, { durable: true });

  for (const eventType of eventTypes) {
    await channel.bindQueue(queue.queue, EXCHANGE_NAME, eventType);
  }

  await channel.consume(queue.queue, async (message) => {
    if (!message) {
      return;
    }

    try {
      const content = JSON.parse(message.content.toString());
      await handler(content.payload, content.eventType);
      channel.ack(message);
    } catch (error) {
      console.error(`[RabbitMQ] ${queueName} failed to handle message`, error.message);
      channel.nack(message, false, false);
    }
  });
}

module.exports = {
  EXCHANGE_NAME,
  createEventBus,
  publishEvent,
  consumeEvents,
};
