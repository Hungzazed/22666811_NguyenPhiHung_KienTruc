const pool = require("./db");

const defaultFoods = [
  {
    name: "Com ga nuong",
    description: "Com ga mem, nuong than, kem salad",
    price: 45000,
  },
  {
    name: "Bun bo Hue",
    description: "Bun bo cay nhe, gio heo, cha",
    price: 50000,
  },
  {
    name: "Pho bo tai",
    description: "Pho bo truyen thong, nuoc dung dam da",
    price: 55000,
  },
  {
    name: "Mi xao hai san",
    description: "Mi xao tom muc, rau cu",
    price: 60000,
  },
];

async function bootstrapDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS foods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description VARCHAR(255) NULL,
      price DECIMAL(12,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM foods");
  const total = Number(rows[0]?.total || 0);

  if (total === 0) {
    for (const food of defaultFoods) {
      await pool.query(
        "INSERT INTO foods (name, description, price) VALUES (?, ?, ?)",
        [food.name, food.description, food.price],
      );
    }
    console.log(`Seeded ${defaultFoods.length} foods`);
  }
}

module.exports = {
  bootstrapDatabase,
};
