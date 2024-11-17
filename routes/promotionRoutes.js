const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const authenticate = require('../middlewares/authMiddleware');

// Discount Offer Routes
router.post('/discount', authenticate(['admin','restaurant_owner']), promotionController.createDiscountOffer);
router.put('/discount/:discount_id', authenticate(['admin','restaurant_owner']), promotionController.updateDiscountOffer);
router.delete('/discount/:discount_id', authenticate(['admin','restaurant_owner']), promotionController.deleteDiscountOffer);

// Special Offers Routes
router.post('/special', authenticate(['admin','restaurant_owner']), promotionController.createSpecialOffer);
router.put('/special/:offer_id', authenticate(['admin','restaurant_owner']), promotionController.updateSpecialOffer);
router.delete('/special/:offer_id', authenticate(['admin','restaurant_owner']), promotionController.deleteSpecialOffer);

// Apply Promotion Code
router.post('/apply', authenticate(['customer']), promotionController.applyPromotionCode);

module.exports = router;