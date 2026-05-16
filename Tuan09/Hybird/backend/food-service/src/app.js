const express = require('express');
const cors = require('cors');
const foodRoutes = require('./routes/foodRoutes');

function createFoodApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'food-service' });
  });

  app.use('/', foodRoutes);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}

module.exports = {
  createFoodApp,
};
