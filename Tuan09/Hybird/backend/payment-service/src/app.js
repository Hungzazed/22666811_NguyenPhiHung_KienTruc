const express = require('express');

function createPaymentApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'payment-service' });
  });

  return app;
}

module.exports = {
  createPaymentApp,
};
