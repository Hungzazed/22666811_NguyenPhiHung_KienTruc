const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

function createProxy(target, sourcePrefix, targetPrefix = '') {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${sourcePrefix}`]: targetPrefix,
    },
    onProxyReq(proxyReq, req) {
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  });
}

function createGatewayApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8081';
  const foodServiceUrl = process.env.FOOD_SERVICE_URL || 'http://localhost:8082';
  const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:8083';

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'api-gateway' });
  });

  app.use('/api/users', createProxy(userServiceUrl, '/api/users'));
  app.use('/api/foods', createProxy(foodServiceUrl, '/api/foods', '/foods'));
  app.use('/api/orders', createProxy(orderServiceUrl, '/api/orders', '/orders'));

  app.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}

module.exports = {
  createGatewayApp,
};
