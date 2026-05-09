const pool = require("../config/db");

async function getUsers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC",
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function validateUserById(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUsers,
  validateUserById,
};
