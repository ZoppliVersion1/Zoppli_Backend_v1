const express = require("express");
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();
const {
	getLoggedInUser,
	updateLoggedInUser,
	manageUserProfile,
	deleteLoggedInUser,
} = require('../controllers/userController');


router.get('/me', authenticate(['restaurant_owner','customer','delivery_partner']), getLoggedInUser);
router.put('/me', authenticate(['restaurant_owner','customer','delivery_partner']), updateLoggedInUser);
router.get('/admin/users/:user_id', authenticate(['restaurant_owner','customer','delivery_partner']),  manageUserProfile);
router.delete('/me', authenticate(['restaurant_owner','customer','delivery_partner']), deleteLoggedInUser);


module.exports = router;