require('dotenv').config();

const { createUserApp } = require('./app');
const { initializeUserDatabase } = require('./config/db');

async function bootstrap() {
  await initializeUserDatabase();

  const app = createUserApp();
  const port = process.env.PORT || 8081;

  app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start User Service', error);
  process.exit(1);
});
