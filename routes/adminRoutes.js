// adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');

// Manage Users Routes
router.get('/users', authenticate(['admin']), adminController.getAllUsers);
router.put('/users/:user_id', authenticate(['admin']), adminController.updateUserByAdmin);
router.delete('/users/:user_id', authenticate(['admin']), adminController.deleteUserByAdmin);

// Manage Restaurants Routes
router.get('/restaurants', authenticate(['admin']), adminController.getAllRestaurants);
router.put('/restaurants/:restaurant_id', authenticate(['admin']), adminController.updateRestaurantByAdmin);
router.delete('/restaurants/:restaurant_id', authenticate(['admin']), adminController.deleteRestaurantByAdmin);

// Manage Orders Routes
router.get('/orders', authenticate(['admin']), adminController.getAllOrders);
router.put('/orders/:order_id', authenticate(['admin']), adminController.updateOrderStatus);
router.delete('/orders/:order_id', authenticate(['admin']), adminController.deleteOrderByAdmin);

module.exports = router;
