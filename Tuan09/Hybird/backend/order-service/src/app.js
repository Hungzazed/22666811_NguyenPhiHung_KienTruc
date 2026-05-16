const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

function createOrderApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'order-service' });
  });

  app.use('/', orderRoutes);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}

module.exports = {
  createOrderApp,
};
