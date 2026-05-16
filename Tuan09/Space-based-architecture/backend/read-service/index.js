const Redis = require('ioredis');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config(); 

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sapassword',
};
const dbName = process.env.DB_NAME || 'flash_sale';

let db;

async function initDB() {
    try {
        // Connect without database first to ensure it exists
        const connection = await mysql.createConnection(dbConfig);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        db = connection;
        
        console.log(`[Service-Write] Connected to MariaDB (Database: ${dbName}).`);

        // Create table if not exists
        await db.execute(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                orderId VARCHAR(255) UNIQUE NOT NULL,
                userId VARCHAR(255) NOT NULL,
                items TEXT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                timestamp DATETIME NOT NULL,
                status VARCHAR(50) DEFAULT 'COMPLETED'
            )
        `);
        console.log('[Service-Write] Orders table ensured.');
    } catch (error) {
        console.error('[Service-Write] Failed to connect to MariaDB:', error.message);
        setTimeout(initDB, 5000);
    }
}

initDB();

const redis = new Redis(redisUrl);
const subscriber = new Redis(redisUrl);

console.log('PU-Persistence (Service-Write) started...');

// Subscribe to order events
subscriber.subscribe('order_created', (err, count) => {
    if (err) {
        console.error('Failed to subscribe:', err.message);
        return;
    }
    console.log(`Subscribed successfully! Listening on ${count} channels.`);
});

subscriber.on('message', async (channel, message) => {
    if (channel === 'order_created') {
        const order = JSON.parse(message);
        console.log(`[Service-Write] Received new order: ${order.orderId}. Persisting to MariaDB...`);
        
        try {
            if (!db) {
                console.error('[Service-Write] DB not connected. Skipping save.');
                return;
            }

            await db.execute(
                'INSERT INTO orders (orderId, userId, items, total, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    order.orderId,
                    order.userId,
                    JSON.stringify(order.items),
                    order.total || 0,
                    new Date(order.timestamp).toISOString().slice(0, 19).replace('T', ' '),
                    order.status || 'COMPLETED'
                ]
            );
            console.log(`[MariaDB] Order ${order.orderId} saved successfully.`);
        } catch (error) {
            console.error('[MariaDB] Failed to save order:', error.message);
        }
    }
});
