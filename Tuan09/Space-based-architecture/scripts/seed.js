const Redis = require('ioredis');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sapassword',
};
const dbName = 'flash_sale';

const products = [
    { id: 'p1', name: 'iPhone 15 Pro', price: '999', description: 'Latest Apple iPhone' },
    { id: 'p2', name: 'Samsung S24 Ultra', price: '1199', description: 'Flagship Samsung phone' },
    { id: 'p3', name: 'Sony WH-1000XM5', price: '349', description: 'Industry leading noise canceling' },
    { id: 'p4', name: 'MacBook Air M3', price: '1099', description: 'Thin and light laptop' },
    { id: 'p5', name: 'PlayStation 5', price: '499', description: 'Next-gen gaming console' }
];

const stocks = {
    'p1': 50,
    'p2': 30,
    'p3': 100,
    'p4': 20,
    'p5': 10
};

async function seed() {
    console.log('--- STARTING SEEDING PROCESS ---');

    // 1. Seed Redis (Data Grid)
    console.log('[Redis] Seeding data...');
    for (const product of products) {
        await redis.hset(`product:${product.id}`, product);
        console.log(`[Redis] Seeded product: ${product.name}`);
    }

    for (const [id, stock] of Object.entries(stocks)) {
        await redis.set(`stock:${id}`, stock);
        console.log(`[Redis] Seeded stock for ${id}: ${stock}`);
    }

    // 2. Seed MariaDB (Persistent DB)
    console.log('[MariaDB] Connecting...');
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);

        console.log('[MariaDB] Creating tables...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT
            )
        `);

        await connection.execute(`
            CREATE TABLE IF NOT EXISTS inventory (
                productId VARCHAR(50) PRIMARY KEY,
                stock INT NOT NULL,
                FOREIGN KEY (productId) REFERENCES products(id)
            )
        `);

        console.log('[MariaDB] Inserting data...');
        for (const product of products) {
            await connection.execute(
                'INSERT INTO products (id, name, price, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), description=VALUES(description)',
                [product.id, product.name, product.price, product.description]
            );
            
            await connection.execute(
                'INSERT INTO inventory (productId, stock) VALUES (?, ?) ON DUPLICATE KEY UPDATE stock=VALUES(stock)',
                [product.id, stocks[product.id]]
            );
            console.log(`[MariaDB] Seeded product & stock: ${product.name}`);
        }

        await connection.end();
        console.log('[MariaDB] Seeding completed.');
    } catch (error) {
        console.error('[MariaDB] Seeding failed:', error.message);
    }

    console.log('--- SEEDING COMPLETED ---');
    process.exit(0);
}

seed().catch(err => {
    console.error('CRITICAL: Seeding failed:', err);
    process.exit(1);
});
