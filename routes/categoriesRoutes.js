const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getDishesByCategory,
  getMenusByCategory
} = require('../controllers/categoriesController');
const authenticate = require('../middlewares/authMiddleware');

// Public route to get all categories
router.get('/', getCategories);

// Admin routes to manage categories
router.post('/', authenticate(['restaurant_owner']), createCategory);
router.put('/:id', authenticate(['restaurant_owner']), updateCategory);
router.delete('/:id', authenticate(['restaurant_owner']), deleteCategory);

// Routes to retrieve dishes and menus by category
router.get('/dishes/:categoryId', getDishesByCategory);
router.get('/menus/:categoryId', getMenusByCategory);

module.exports = router;
