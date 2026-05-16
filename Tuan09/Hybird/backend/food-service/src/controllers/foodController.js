const foodService = require('../services/foodService');

async function getFoods(_req, res) {
  try {
    const foods = await foodService.getFoods();
    res.json({ data: foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getFoodById(req, res) {
  try {
    const food = await foodService.getFoodDetail(req.params.id);
    res.json({ data: food });
  } catch (error) {
    const status = error.message === 'Food not found' ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
}

module.exports = {
  getFoods,
  getFoodById,
};
