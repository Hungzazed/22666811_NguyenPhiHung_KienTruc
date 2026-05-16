require('dotenv').config();

const { createGatewayApp } = require('./app');

const port = process.env.PORT || 8080;
const app = createGatewayApp();

app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
