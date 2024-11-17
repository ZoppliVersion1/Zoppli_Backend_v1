const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middlewares/authMiddleware'); // Assuming you have a middleware for authentication

// Retrieve all notifications for a user
router.get('/', authenticate(['customer', 'restaurant_owner', 'delivery_partner']), notificationController.getUserNotifications);

// Send a new notification (Admin/Owner access)
router.post('/', authenticate(['restaurant_owner']), notificationController.sendNotification);

// Delete a notification (Admin/Owner access)
router.delete('/:notificationId', authenticate(['restaurant_owner']), notificationController.deleteNotification);

module.exports = router;
