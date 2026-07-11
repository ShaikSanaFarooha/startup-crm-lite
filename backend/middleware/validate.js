import { validationResult } from 'express-validator';

/**
 * Middleware wrapper to run validations and return error responses if they fail.
 * 
 * @param {Array<Object>} validations - Array of validation chains created via express-validator.
 * @returns {Array<Function>} An array of middleware functions (validation chains + final result checker).
 */
export const validate = (validations) => {
  return [
    // Run all validations first
    ...validations,
    // Final middleware to check validation results and handle errors
    async (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format validation errors to { field, message }
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      }));

      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    },
  ];
};
export default validate;
