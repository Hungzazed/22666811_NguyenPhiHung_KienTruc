const express = require('express');
const Redis = require('ioredis');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 8083;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8084';
const cartServiceUrl = process.env.CART_SERVICE_URL || 'http://localhost:8082';

const redis = new Redis(redisUrl);

app.use(cors());
app.use(express.json());

// PU3 - Order Service: POST /checkout
app.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    try {
        // 1. Get cart from Cart PU (or directly from Redis for better SBA performance)
        // Since SBA encourages local processing, let's read from Redis directly
        const cart = await redis.hgetall(`cart:${userId}`);
        if (!cart || Object.keys(cart).length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const items = Object.entries(cart);
        const results = [];
        let cartTotal = 0;

        // 2. Reduce stock for each item (calling Inventory PU)
        // In a real high-scale system, we might use a saga or distributed lock
        // Here we do it sequentially or in parallel for demo
        for (const [productId, quantity] of items) {
            try {
                const response = await axios.post(`${inventoryServiceUrl}/stock/reduce`, {
                    productId,
                    quantity: parseInt(quantity)
                });
                
                // Get product price to calculate total (in real SBA, this info might be in the PU-local cache)
                const product = await redis.hgetall(`product:${productId}`);
                cartTotal += (parseFloat(product.price || 0) * parseInt(quantity));

                results.push({ productId, success: true, remaining: response.data.remaining });
            } catch (error) {
                // If one fails (e.g. out of stock), we might want to rollback
                // For simplicity in this demo, we'll just report the error
                return res.status(400).json({ 
                    error: `Failed to reduce stock for product ${productId}`,
                    details: error.response ? error.response.data : error.message
                });
            }
        }

        // 3. Create Order in Redis
        const orderId = `order_${Date.now()}_${userId}`;
        const orderData = {
            userId,
            items: JSON.stringify(cart),
            timestamp: new Date().toISOString(),
            status: 'COMPLETED'
        };
        await redis.hset(`order:${orderId}`, orderData);
        await redis.lpush(`user_orders:${userId}`, orderId);

        // 4. Clear Cart
        await redis.del(`cart:${userId}`);

        // 5. Publish Event for Asynchronous Persistence (Matches the "message" block in the diagram)
        const eventData = {
            orderId,
            userId,
            items: cart,
            total: cartTotal,
            timestamp: orderData.timestamp
        };
        await redis.publish('order_created', JSON.stringify(eventData));

        res.json({ message: 'Order placed successfully', orderId, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Order PU running on port ${port}`);
});
