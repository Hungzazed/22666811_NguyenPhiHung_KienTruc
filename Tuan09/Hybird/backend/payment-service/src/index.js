require('dotenv').config();

const { createPaymentApp } = require('./app');
const { initializePaymentEventBus } = require('./config/rabbitmq');
const { startPaymentConsumer } = require('./services/paymentService');

async function bootstrap() {
  await initializePaymentEventBus();
  await startPaymentConsumer();

  const app = createPaymentApp();
  const port = process.env.PORT || 8084;

  app.listen(port, () => {
    console.log(`Payment Service running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Payment Service', error);
  process.exit(1);
});
