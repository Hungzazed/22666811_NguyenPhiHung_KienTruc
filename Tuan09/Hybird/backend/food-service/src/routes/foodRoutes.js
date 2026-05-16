const express = require('express');
const foodController = require('../controllers/foodController');

const router = express.Router();

router.get('/foods', foodController.getFoods);
router.get('/foods/:id', foodController.getFoodById);

module.exports = router;
