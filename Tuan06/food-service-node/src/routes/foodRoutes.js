const express = require("express");
const {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const router = express.Router();

router.get("/foods", getFoods);
router.post("/foods", createFood);
router.put("/foods/:id", updateFood);
router.delete("/foods/:id", deleteFood);

module.exports = router;
