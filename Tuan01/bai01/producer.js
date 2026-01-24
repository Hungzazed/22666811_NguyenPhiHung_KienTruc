const amqp = require('amqplib');


function randomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomString = (length) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  return `${randomString(8)}@${randomString(5)}.com`;
}


async function pushMessage() {
  try {
    console.log('Connecting to RabbitMQ...');

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'queue';
    await channel.assertQueue(queue);
    const TOTAL_MESSAGES = 5;

    for (let i = 1; i <= TOTAL_MESSAGES; i++) {
      const email = randomEmail();
      const message = JSON.stringify({
        id: i,
        email: email,
        createdAt: new Date().toISOString(),
      });

      channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
      console.log(`✔ Sent ${i}:`, email);
    }

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

pushMessage();
