const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController'); // Ensure path is correct
const authenticate = require('../middlewares/authMiddleware');  // Ensure path is correct

// Routes for restaurant owners (protected routes)
router.post('/', authenticate(['restaurant_owner']), dishController.addDish);
router.put('/:dish_id', authenticate(['restaurant_owner']), dishController.updateDish);
router.delete('/:dish_id', authenticate(['restaurant_owner']), dishController.deleteDish);

// Public routes for retrieving dishes
router.get('/', dishController.getDishesByRestaurant);
router.get('/menu-dishes/:menu_id', dishController.getDishesByMenu);
router.get('/search', dishController.searchDishes);

module.exports = router;
