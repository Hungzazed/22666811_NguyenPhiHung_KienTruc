class Order {
  constructor({ id, userId, foodId, quantity, totalPrice, status }) {
    this.id = id;
    this.userId = userId;
    this.foodId = foodId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.status = status;
  }
}

module.exports = Order;
