const express = require("express");
const { getUsers, validateUserById } = require("../controllers/userController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/users", requireAuth, requireAdmin, getUsers);
router.get("/users/:id/validate", validateUserById);

module.exports = router;
