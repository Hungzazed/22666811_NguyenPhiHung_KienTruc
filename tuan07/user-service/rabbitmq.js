require('dotenv').config();
const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
let channel = null;
const EXCHANGE_NAME = 'movie_events_exchange';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Sử dụng Fanout Exchange để mọi service đều nhận được event
        await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
        
        console.log('[RabbitMQ] Connected and Exchange asserted');
    } catch (error) {
        console.error('[RabbitMQ] Connection failed', error);
    }
}

function getChannel() {
    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel,
    EXCHANGE_NAME
};
