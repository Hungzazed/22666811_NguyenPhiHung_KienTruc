const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 8000;

// 1. Mở CORS tối đa cho Demo
app.use(cors({
    origin: '*', 
    methods: '*',
    allowedHeaders: '*',
    credentials: true
}));

app.use(morgan('dev'));

// Cấu hình các Service
const targets = {
    user: 'http://172.16.65.56:8081',
    movie: 'http://172.16.65.60:8082',
    booking: 'http://172.16.35.63:8083'
};

// Test route để kiểm tra Gateway có sống không
app.get('/gateway-health', (req, res) => {
    res.send('API Gateway is UP and RUNNING on port 8000');
});

// 2. Định nghĩa Proxy theo cú pháp v4.x
// Quan trọng: Dùng pathFilter trong options thay vì truyền đối số bên ngoài

// Route cho User Service
app.use(createProxyMiddleware({
    target: targets.user,
    pathFilter: ['/login', '/register', '/users'],
    changeOrigin: true,
    logger: console,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[GATEWAY] Routing to User Service: ${req.method} ${req.url}`);
    }
}));

// Route cho Movie Service
app.use(createProxyMiddleware({
    target: targets.movie,
    pathFilter: ['/movies'],
    changeOrigin: true,
    logger: console,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[GATEWAY] Routing to Movie Service: ${req.method} ${req.url}`);
    }
}));

// Route cho Booking Service
app.use(createProxyMiddleware({
    target: targets.booking,
    pathFilter: ['/bookings'],
    changeOrigin: true,
    logger: console,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[GATEWAY] Routing to Booking Service: ${req.method} ${req.url}`);
    }
}));

app.listen(PORT, () => {
    console.log(`\n🚀 API GATEWAY v4.0 IS READY AT http://localhost:${PORT}`);
    console.log(`- /login, /register, /users -> :8081`);
    console.log(`- /movies -> :8082`);
    console.log(`- /bookings -> :8083\n`);
});
