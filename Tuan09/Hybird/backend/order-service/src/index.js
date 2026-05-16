require('dotenv').config();

const { createOrderApp } = require('./app');
const { initializeOrderDatabase } = require('./config/db');
const { initializeOrderEventBus } = require('./config/rabbitmq');

async function bootstrap() {
  await initializeOrderDatabase();
  await initializeOrderEventBus();

  const app = createOrderApp();
  const port = process.env.PORT || 8083;

  app.listen(port, () => {
    console.log(`Order Service running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Order Service', error);
  process.exit(1);
});
