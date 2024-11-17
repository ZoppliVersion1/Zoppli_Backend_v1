const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword,
  verifyEmail,
  refreshToken,
  launchRegister,
  joinWaitlist
} = require('../controllers/authController');

const authenticate = require('../middlewares/authMiddleware'); // Import the middleware

const router = express.Router();

// Public Routes (No authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);

// Route for initial launch registration (no OTP)
router.post('/launchRegister', launchRegister);
router.post('/joinWaitlist', joinWaitlist);

// Authenticated Routes (Requires login, no specific role needed)
router.post('/refresh-token', authenticate(), refreshToken);  // Only needs user to be authenticated
router.post('/logout', authenticate(), logoutUser);            // Any authenticated user can log out

module.exports = router;