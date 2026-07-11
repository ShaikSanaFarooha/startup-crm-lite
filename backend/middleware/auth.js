import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes by validating JSON Web Tokens (JWT).
 * Extracts the token from the Authorization header, verifies it, and attaches the active user to req.user.
 * 
 * @async
 * @function protect
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Extract token from Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is provided in the header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided, access denied',
    });
  }

  try {
    // 2. Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in the database (exclude password field)
    const user = await User.findById(decoded.id).select('-password');
    
    // If the user no longer exists in the database
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      });
    }

    // 4. Attach the authenticated user object to the request context
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT expiration error
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired, please login again',
      });
    }
    // Handle invalid token signatures / malformed tokens
    return res.status(401).json({
      success: false,
      message: 'Token is invalid',
    });
  }
};
