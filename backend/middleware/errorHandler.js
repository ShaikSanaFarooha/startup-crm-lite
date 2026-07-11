/**
 * Global Express error handling middleware.
 * Formats errors and maps common Mongoose, MongoDB, and JWT errors
 * to standardized HTTP status codes and responses.
 * 
 * @param {Object} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  // Create a copy of the error to work with
  let error = { ...err };
  error.message = err.message || '';

  // Log full stack trace in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', err);
  }

  // 1. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const validationErrors = {};
    Object.keys(err.errors).forEach((key) => {
      validationErrors[key] = err.errors[key].message;
    });

    error.statusCode = 400;
    error.message = 'Validation failed';
    error.errors = validationErrors;
  }

  // 2. Mongoose CastError (e.g. invalid ObjectId lookup)
  else if (err.name === 'CastError') {
    error.statusCode = 404;
    error.message = 'Resource not found';
  }

  // 3. MongoDB Duplicate Key Error (Code 11000)
  else if (err.code === 11000) {
    error.statusCode = 409;
    error.message = 'Email already exists';
  }

  // 4. JWT Validation Errors
  else if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token. Please log in again.';
  }

  // 5. JWT Expiration Error
  else if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token has expired. Please log in again.';
  }

  // Retrieve status code and message with defaults
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production' 
    ? 'Server error' 
    : error.message || 'Server error';

  // Construct response payload
  const response = {
    success: false,
    message,
  };

  // Add validation details if present
  if (error.errors) {
    response.errors = error.errors;
  }

  // Expose stack trace in development mode only
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
