function normalizeCreateOrderPayload(body = {}) {
  const userId = Number(body.userId);
  const foodId = Number(body.foodId);
  const quantity = Number(body.quantity || 1);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('userId is required');
  }

  if (!Number.isInteger(foodId) || foodId <= 0) {
    throw new Error('foodId is required');
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('quantity must be greater than 0');
  }

  return { userId, foodId, quantity };
}

module.exports = {
  normalizeCreateOrderPayload,
};
