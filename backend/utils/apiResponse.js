/**
 * Sends a standardized success API response.
 * 
 * @param {Object} res - The Express response object.
 * @param {Any} data - The payload to be returned to the client.
 * @param {String} message - The contextual success message.
 * @param {Number} [statusCode=200] - The HTTP status code.
 * @returns {Object} The JSON response object.
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error API response.
 * 
 * @param {Object} res - The Express response object.
 * @param {String} message - The error message description.
 * @param {Number} [statusCode=500] - The HTTP status code.
 * @param {Object|Array|null} [errors=null] - Detailed error parameters (e.g. validation field issues).
 * @returns {Object} The JSON response object.
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };

  if (errors !== null) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Sends a standardized paginated data API response.
 * 
 * @param {Object} res - The Express response object.
 * @param {Array} data - The paginated list of items.
 * @param {Number} total - The total number of records across all pages.
 * @param {Number} page - The current page number.
 * @param {Number} limit - The page limit size.
 * @returns {Object} The JSON response object.
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const totalRecords = Number(total);
  const currentPage = Number(page);
  const pageLimit = Number(limit);

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total: totalRecords,
      page: currentPage,
      limit: pageLimit,
      pages: Math.ceil(totalRecords / pageLimit),
    },
  });
};
