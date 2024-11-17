const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authenticate  = require('../middlewares/authMiddleware');

// Retrieve all menus for a restaurant
router.get('/:restaurantId', menuController.getMenusByRestaurant);

// Create a new menu (Admin/Owner)
// router.post('/:restaurantId', authenticate(['restaurant_owner']), menuController.createMenu);
router.post('/:restaurantId', menuController.createMenu);

// Update an existing menu (Admin/Owner)
// router.put('/:menuId', authenticate(['restaurant_owner']), menuController.updateMenu);
router.put('/:menuId', menuController.updateMenu);

// Delete a menu (Admin/Owner)
// router.delete('/:menuId', authenticate(['restaurant_owner']), menuController.deleteMenu);
router.delete('/:menuId', menuController.deleteMenu);

module.exports = router;
