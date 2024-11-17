const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const dishController = require('../controllers/dishController');
const categoryController = require('../controllers/categoryController.js');

// Search restaurants with optional filters
router.get('/restaurants', restaurantController.searchRestaurants);

// Search dishes with optional filters
router.get('/dishes', dishController.searchDishes);

// Search categories
router.get('/categories', categoryController.searchCategories);

module.exports = router;
