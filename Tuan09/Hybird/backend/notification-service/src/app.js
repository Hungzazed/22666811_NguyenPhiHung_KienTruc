const express = require('express');

function createNotificationApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'notification-service' });
  });

  return app;
}

module.exports = {
  createNotificationApp,
};
