const amqp = require('amqplib');

async function getMessage() {
  try {
    console.log('Connecting to RabbitMQ...');

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const queue = 'queue';
    await channel.assertQueue(queue);

    setTimeout(() => {
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          console.log('📩 Received:', msg.content.toString());
          channel.ack(msg);
        }
      });
    }, 3000)

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

getMessage();
