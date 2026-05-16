const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 8082;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

app.use(cors());
app.use(express.json());

// PU2 - Cart Service: POST /cart/add
app.post('/cart/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Missing userId or productId' });

    try {
        const cartKey = `cart:${userId}`;
        // Store as a hash: productId -> quantity
        await redis.hset(cartKey, productId, quantity || 1);
        res.json({ message: 'Added to cart', userId, productId, quantity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PU2 - Cart Service: GET /cart/:userId
app.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await redis.hgetall(`cart:${req.params.userId}`);
        res.json(cart || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper: Clear cart (used by Order PU)
app.delete('/cart/:userId', async (req, res) => {
    try {
        await redis.del(`cart:${req.params.userId}`);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Cart PU running on port ${port}`);
});
