import express from 'express';
import { body } from 'express-validator';

// Controllers & Middlewares
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// NOTE: For production environments, a rate limiting middleware like 'express-rate-limit' 
// should be registered globally on the server or specifically on this router:
// e.g. router.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

/**
 * Validation rules for user registration.
 */
const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for user login.
 */
const loginValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for user profile updates.
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .trim(),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// --- Authentication Endpoints ---

// POST /api/auth/register
router.post('/register', validate(registerValidation), register);

// POST /api/auth/login
router.post('/login', validate(loginValidation), login);

// GET /api/auth/me (Retrieve authenticated user's profile)
router.get('/me', protect, getProfile);

// GET /api/auth/profile (Retrieve authenticated user's profile - alias)
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile (Update profile)
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

// PUT /api/auth/me (Update profile - alias)
router.put('/me', protect, validate(updateProfileValidation), updateProfile);

export default router;
