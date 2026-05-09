const pool = require("../config/db");

async function getFoods(_req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description, price, created_at, updated_at FROM foods ORDER BY id DESC",
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createFood(req, res) {
  try {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "name and price are required" });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res
        .status(400)
        .json({ message: "price must be a valid positive number" });
    }

    const [result] = await pool.query(
      "INSERT INTO foods (name, description, price) VALUES (?, ?, ?)",
      [name, description || null, numericPrice],
    );

    return res.status(201).json({
      message: "Food created",
      id: result.insertId,
      name,
      description: description || null,
      price: numericPrice,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateFood(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, description, price } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid food id" });
    }

    const [existing] = await pool.query("SELECT id FROM foods WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }

    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res
          .status(400)
          .json({ message: "price must be a valid positive number" });
      }
      fields.push("price = ?");
      values.push(numericPrice);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    values.push(id);

    await pool.query(
      `UPDATE foods SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    const [updatedRows] = await pool.query(
      "SELECT id, name, description, price, created_at, updated_at FROM foods WHERE id = ?",
      [id],
    );

    return res.json({ message: "Food updated", food: updatedRows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteFood(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid food id" });
    }

    const [result] = await pool.query("DELETE FROM foods WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.json({ message: "Food deleted", id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
};
