const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');
const { validate, sanitizeBody, loginSchema, refreshTokenSchema, logoutSchema, changePasswordSchema } = require('../validators/authValidator');
const { createAccountLockout, apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to login endpoint
const loginLockout = createAccountLockout(5, 15); // 5 attempts, 15 minutes

// POST /api/auth/login - Employee login
router.post('/login',
  loginLockout,
  validate(loginSchema, 'body'),
  sanitizeBody,
  AuthController.login
);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh',
  validate(refreshTokenSchema, 'body'),
  sanitizeBody,
  AuthController.refreshToken
);

// POST /api/auth/logout - Employee logout
router.post('/logout',
  authenticateToken,
  validate(logoutSchema, 'body'),
  sanitizeBody,
  AuthController.logout
);

// GET /api/auth/me - Get current user profile
router.get('/me', authenticateToken, AuthController.getProfile);

// POST /api/auth/change-password - Change password
router.post('/change-password',
  authenticateToken,
  strictLimiter, // Stricter rate limiting for sensitive operations
  validate(changePasswordSchema, 'body'),
  sanitizeBody,
  AuthController.changePassword
);

module.exports = router;