require('dotenv').config();

const { createFoodApp } = require('./app');
const { initializeFoodDatabase } = require('./config/db');

async function bootstrap() {
  await initializeFoodDatabase();

  const app = createFoodApp();
  const port = process.env.PORT || 8082;

  app.listen(port, () => {
    console.log(`Food Service running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Food Service', error);
  process.exit(1);
});
