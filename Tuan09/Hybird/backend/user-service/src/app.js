const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

function createUserApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
  });

  app.use('/', authRoutes);

  app.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  return app;
}

module.exports = {
  createUserApp,
};
