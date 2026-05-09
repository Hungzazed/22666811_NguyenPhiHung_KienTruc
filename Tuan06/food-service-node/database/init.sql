CREATE DATABASE IF NOT EXISTS mini_food_ordering;
USE mini_food_ordering;

CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255) NULL,
  price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO foods (name, description, price)
SELECT 'Com ga nuong', 'Com ga mem, nuong than, kem salad', 45000
WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = 'Com ga nuong');

INSERT INTO foods (name, description, price)
SELECT 'Bun bo Hue', 'Bun bo cay nhe, gio heo, cha', 50000
WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = 'Bun bo Hue');

INSERT INTO foods (name, description, price)
SELECT 'Pho bo tai', 'Pho bo truyen thong, nuoc dung dam da', 55000
WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = 'Pho bo tai');

INSERT INTO foods (name, description, price)
SELECT 'Mi xao hai san', 'Mi xao tom muc, rau cu', 60000
WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = 'Mi xao hai san');
