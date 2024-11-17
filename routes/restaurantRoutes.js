const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authenticate  = require('../middlewares/authMiddleware');

// Route to retrieve all restaurants
router.get('/', restaurantController.getAllRestaurants);

// Route to retrieve details of a specific restaurant
router.get('/:id', restaurantController.getRestaurantById);

// Route to create a new restaurant (admin/owner)
router.post('/',restaurantController.createRestaurant);
// router.post('/', authenticate(['restaurant_owner']), restaurantController.createRestaurant);

// Route to update a restaurant's details (admin/owner)
router.put('/:id',restaurantController.updateRestaurant);
// router.put('/:id', authenticate(['restaurant_owner']), restaurantController.updateRestaurant);

// Route to delete a restaurant (admin/owner)
router.delete('/:id',  restaurantController.deleteRestaurant);
// router.delete('/:id', authenticate(['restaurant_owner']), restaurantController.deleteRestaurant);

module.exports = router;
