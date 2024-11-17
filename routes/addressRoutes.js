const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticate = require('../middlewares/authMiddleware');  // Assuming you have an authentication middleware

// Retrieve addresses for the current user
router.get('/', authenticate(['customer', 'restaurant_owner', 'delivery_partner']), addressController.getUserAddresses);

// Add a new address
router.post('/', authenticate(['customer', 'restaurant_owner', 'delivery_partner']), addressController.addAddress);

// Update an address
router.put('/:addressId', authenticate(['customer', 'restaurant_owner', 'delivery_partner']), addressController.updateAddress);

// Delete an address
router.delete('/:addressId', authenticate(['customer', 'restaurant_owner', 'delivery_partner']), addressController.deleteAddress);

module.exports = router;
