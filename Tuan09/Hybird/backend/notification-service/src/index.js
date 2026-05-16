require('dotenv').config();

const { createNotificationApp } = require('./app');
const { initializeNotificationEventBus } = require('./config/rabbitmq');
const { startNotificationConsumer } = require('./services/notificationService');

async function bootstrap() {
  await initializeNotificationEventBus();
  await startNotificationConsumer();

  const app = createNotificationApp();
  const port = process.env.PORT || 8085;

  app.listen(port, () => {
    console.log(`Notification Service running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Notification Service', error);
  process.exit(1);
});
