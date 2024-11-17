const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authMiddleware');

// Retrieve current user's cart
router.get('/', authenticate(['customer', 'restaurant_owner']), cartController.getCart);

// Add an item to the cart
router.post('/', authenticate(['customer', 'restaurant_owner']), cartController.addItemToCart);

// Update an item in the cart
router.put('/', authenticate(['customer', 'restaurant_owner']), cartController.updateCartItem);

// Delete an item from the cart
router.delete('/', authenticate(['customer', 'restaurant_owner']), cartController.deleteCartItem);

module.exports = router;
