const mysql = require('mysql2/promise');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createDatabasePool({ host, port, user, password, database }) {
  let lastError;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      const adminConnection = await mysql.createConnection({
        host,
        port,
        user,
        password,
      });

      await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      await adminConnection.end();

      return mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } catch (error) {
      lastError = error;
      await delay(2000);
    }
  }

  throw lastError;
}

module.exports = {
  createDatabasePool,
};
