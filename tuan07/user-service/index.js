const express = require('express');
const cors = require('cors');
const { connectRabbitMQ, getChannel, EXCHANGE_NAME } = require('./rabbitmq');
const db = require('./db');

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);


    // if (!username || !password) {
    //     return res.status(400).json({ message: 'Username and password are required' });
    // }

    // try {
    //     const [existingUsers] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

    //     if (existingUsers.length > 0) {
    //         return res.status(400).json({ message: 'Username already exists' });
    //     }

    //     const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    //     const newUserId = result.insertId;

    // Publish event to Exchange
    const channel = getChannel();
    if (channel) {
        const event = {
            type: "USER_REGISTERED",
            username: username,
            id: Math.random() + 1
        };
        channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(event)));
        console.log('[User Service] USER_REGISTERED published to exchange');
    }

    res.status(201).json({ message: 'User registered successfully', user: { id: 1, username } });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Database error' });
    // }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (username === "admin" && password === "123") {
            res.status(200).json({ message: 'Login successful', user: { username: username } });
        } else {
            res.status(500).json({ message: 'Database error' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
});

app.listen(PORT, async () => {
    console.log(`[User Service] running on port ${PORT}`);
    await connectRabbitMQ();
});
