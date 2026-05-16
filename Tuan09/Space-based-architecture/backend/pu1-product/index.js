const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 8081;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

app.use(cors());
app.use(express.json());

// PU1 - Product Service: GET /products
app.get('/products', async (req, res) => {
    try {
        const productKeys = await redis.keys('product:*');
        if (productKeys.length === 0) return res.json([]);
        
        const products = await Promise.all(
            productKeys.map(async (key) => {
                const product = await redis.hgetall(key);
                return { id: key.split(':')[1], ...product };
            })
        );
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PU1 - Product Service: GET /products/:id
app.get('/products/:id', async (req, res) => {
    try {
        const product = await redis.hgetall(`product:${req.params.id}`);
        if (!product || Object.keys(product).length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ id: req.params.id, ...product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Product PU running on port ${port}`);
});
