/**
 * API Error Class
 * Custom error class for handling API errors
 */

class ApiError extends Error {
  /**
   * Create an API Error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {any} errors - Additional error details
   * @param {boolean} isOperational - Is this an operational error
   */
  constructor(statusCode, message, errors = null, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Bad Request Error (400)
   */
  static badRequest(message = 'Bad request', errors = null) {
    return new ApiError(400, message, errors);
  }

  /**
   * Unauthorized Error (401)
   */
  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  /**
   * Forbidden Error (403)
   */
  static forbidden(message = 'Access forbidden') {
    return new ApiError(403, message);
  }

  /**
   * Not Found Error (404)
   */
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  /**
   * Conflict Error (409)
   */
  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message);
  }

  /**
   * Validation Error (422)
   */
  static validation(message = 'Validation failed', errors = null) {
    return new ApiError(422, message, errors);
  }

  /**
   * Too Many Requests Error (429)
   */
  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  /**
   * Internal Server Error (500)
   */
  static internal(message = 'Internal server error') {
    return new ApiError(500, message, null, false);
  }
}

export default ApiError;
