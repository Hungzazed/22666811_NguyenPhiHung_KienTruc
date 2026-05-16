const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const port = process.env.PORT || 8084;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl);

app.use(cors());
app.use(express.json());

// PU4 - Inventory Service: GET /stock/:productId
app.get('/stock/:productId', async (req, res) => {
    try {
        const stock = await redis.get(`stock:${req.params.productId}`);
        res.json({ productId: req.params.productId, stock: parseInt(stock) || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PU4 - Inventory Service: POST /stock/reduce
// Using a Lua script for atomic stock reduction (check + decr)
const reduceStockScript = `
local stock = tonumber(redis.call('get', KEYS[1]))
if not stock then
    return -1
end
local quantity = tonumber(ARGV[1])
if stock >= quantity then
    return redis.call('decrby', KEYS[1], quantity)
else
    return -2
end
`;

app.post('/stock/reduce', async (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) return res.status(400).json({ error: 'Missing productId or quantity' });

    try {
        const result = await redis.eval(reduceStockScript, 1, `stock:${productId}`, quantity);
        
        if (result === -1) return res.status(404).json({ error: 'Product stock not found' });
        if (result === -2) return res.status(400).json({ error: 'Insufficient stock' });
        
        res.json({ message: 'Stock reduced', remaining: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Inventory PU running on port ${port}`);
});
