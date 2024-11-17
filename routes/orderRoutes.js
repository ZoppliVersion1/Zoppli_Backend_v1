const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');

// Place an order
router.post('/place', authenticate(['restaurant_owner','customer']), orderController.placeOrder);

// Retrieve order history for the user
router.get('/history', authenticate(['restaurant_owner','customer']), orderController.getOrderHistory);

// Update order status
router.put('/status', authenticate(['restaurant_owner', 'delivery_partner']), orderController.updateOrderStatus);

// Cancel an order
router.post('/cancel', authenticate(['restaurant_owner','customer']), orderController.cancelOrder);

module.exports = router;