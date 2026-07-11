import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper function to generate JWT.
 * Uses the user's ID as payload, signing it with JWT_SECRET.
 * 
 * @param {string} userId - The database Object ID of the user.
 * @returns {string} The signed JWT.
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Handles new user registration.
 * 
 * @async
 * @function register
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
  // NOTE: For production environments, a rate limiter middleware like 'express-rate-limit' 
  // should be added to registration/login routes to prevent brute-force attacks.
  try {
    const { name, email, password, role } = req.body;

    // Check if the email address is already in use
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // Create the new User document
    const user = await User.create({
      name,
      email,
      password, // Password hashing is handled via pre-save hook in User model
      role: role || 'user',
    });

    // Generate JWT for the newly registered user
    const token = generateToken(user._id);

    // successResponse uses res.json under the hood which triggers user.toJSON() automatic password exclusion
    return successResponse(
      res,
      { token, user },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login authentication.
 * 
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {Promise<void>}
 */
export const login = async (req, res, next) => {
  // NOTE: For production environments, a rate limiter middleware like 'express-rate-limit' 
  // should be added here to limit brute-force credential guessing attempts.
  try {
    const { email, password } = req.body;

    // Retrieve user including the password field (which is normally selected out)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // General response to prevent account harvesting
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if the user's account has been deactivated
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Return the response (toJSON handles password cleanup)
    return successResponse(
      res,
      { token, user },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the currently authenticated user's profile.
 * 
 * @async
 * @function getProfile
 * @param {Object} req - Express request object (user already attached by protect middleware).
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(
      res,
      req.user,
      'User profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Updates the user's profile settings (supports changing name and/or password).
 * 
 * @async
 * @function updateProfile
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {Promise<void>}
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Find the user and explicitly fetch password to verify current password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // 1. Handle name update (email updates are restricted to verification flows)
    if (name) {
      user.name = name;
    }

    // 2. Handle password update if new password is provided
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Current password is required to update password', 400);
      }

      // Check that the entered old password is correct
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect', 401);
      }

      // Assign the new password (will be hashed automatically during user.save())
      user.password = newPassword;
    }

    // Save changes (triggers pre-save middleware hooks)
    const updatedUser = await user.save();

    return successResponse(
      res,
      updatedUser,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
};
