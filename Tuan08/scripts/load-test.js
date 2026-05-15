const axios = require('axios');

const PU3_URL = 'http://localhost:8083';
const PU2_URL = 'http://localhost:8082';

async function simulate() {
    console.log('Starting Load Test Simulation...');
    const userId = 'tester_' + Math.floor(Math.random() * 1000);
    const productId = 'p5'; // Limited stock item

    console.log(`User ${userId} attempting to buy ${productId}...`);

    try {
        // 1. Add to cart
        await axios.post(`${PU2_URL}/cart/add`, {
            userId,
            productId,
            quantity: 1
        });
        console.log(`[${userId}] Added to cart`);

        // 2. Checkout
        const start = Date.now();
        const res = await axios.post(`${PU3_URL}/checkout`, { userId });
        const end = Date.now();

        console.log(`[${userId}] Checkout Success: ${res.data.orderId} (${end - start}ms)`);
    } catch (err) {
        console.log(`[${userId}] Checkout Failed: ${err.response?.data?.error || err.message}`);
    }
}

// Run 10 concurrent requests
async function runTest() {
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(simulate());
    }
    await Promise.all(promises);
    console.log('Load test finished.');
}

runTest();
