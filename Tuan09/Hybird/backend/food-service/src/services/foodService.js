const foodRepository = require('../repositories/foodRepository');

async function getFoods() {
  return foodRepository.findAllFoods();
}

async function getFoodDetail(id) {
  const food = await foodRepository.findFoodById(id);
  if (!food) {
    throw new Error('Food not found');
  }

  return food;
}

module.exports = {
  getFoods,
  getFoodDetail,
};
