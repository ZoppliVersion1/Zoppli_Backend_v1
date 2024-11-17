const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');  // Assuming you have an auth middleware

// Route to add a review (authenticated users only)
// router.post('/', authenticate(['customer']), reviewController.addReview);
router.post('/', authenticate(['restaurant_owner']), reviewController.addReview);

// Route to get reviews for a restaurant (public)
router.get('/:restaurant_id', authenticate(['restaurant_owner']), reviewController.getReviewsByRestaurant);

module.exports = router;
