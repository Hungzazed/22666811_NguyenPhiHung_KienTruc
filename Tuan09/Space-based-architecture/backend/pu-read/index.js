const express = require('express');
const Redis = require('ioredis');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 8085;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sapassword',
};
const dbName = process.env.DB_NAME || 'flash_sale';

const redis = new Redis(redisUrl);
let db;

app.use(cors());
app.use(express.json());

// --- Database Initialization ---
async function initDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        db = connection;
        
        console.log(`[Service-Read] Connected to MariaDB (Database: ${dbName}).`);
        await rehydrate();
    } catch (error) {
        console.error('[Service-Read] Failed to connect to MariaDB:', error.message);
        setTimeout(initDB, 5000);
    }
}

// --- Service-Read Logic ---

async function rehydrate() {
    console.log('[Service-Read] Starting Data Rehydration from MariaDB...');
    if (!db) return;

    try {
        const [rows] = await db.execute('SELECT * FROM orders');
        console.log(`[Service-Read] Found ${rows.length} orders in MariaDB. Synchronizing to Redis...`);

        for (const order of rows) {
            const orderId = order.orderId;
            const userId = order.userId;

            const exists = await redis.exists(`order:${orderId}`);
            if (!exists) {
                const orderData = {
                    userId,
                    items: typeof order.items === 'string' ? order.items : JSON.stringify(order.items),
                    timestamp: order.timestamp.toISOString(),
                    status: order.status
                };
                await redis.hset(`order:${orderId}`, orderData);
                
                const userOrders = await redis.lrange(`user_orders:${userId}`, 0, -1);
                if (!userOrders.includes(orderId)) {
                    await redis.rpush(`user_orders:${userId}`, orderId);
                }
            }
        }
        console.log('[Service-Read] Rehydration completed successfully.');
    } catch (error) {
        console.error('[Service-Read] Rehydration failed:', error.message);
    }
}

initDB();

// --- API Endpoints ---

app.get('/orders/history/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!db) return res.status(503).json({ error: 'Database not connected' });

    try {
        const [rows] = await db.execute('SELECT * FROM orders WHERE userId = ?', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/sync', async (req, res) => {
    await rehydrate();
    res.json({ message: 'Sync triggered successfully' });
});

app.listen(port, () => {
    console.log(`Service-Read (PU-Read) running on port ${port}`);
});
