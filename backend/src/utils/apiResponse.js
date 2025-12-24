/**
 * API Response Utility
 * Standardized response format for all API endpoints
 */

class ApiResponse {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {any} data - Response data
   * @param {Object} meta - Additional metadata (pagination, etc.)
   */
  static success(res, statusCode = 200, message = 'Success', data = null, meta = null) {
    const response = {
      success: true,
      message,
      data,
    };

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Created response (201)
   */
  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * No content response (204)
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {any} errors - Error details
   */
  static error(res, statusCode = 500, message = 'Internal server error', errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Bad request response (400)
   */
  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, 400, message, errors);
  }

  /**
   * Unauthorized response (401)
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, 401, message);
  }

  /**
   * Forbidden response (403)
   */
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, 403, message);
  }

  /**
   * Not found response (404)
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Conflict response (409)
   */
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, 409, message);
  }

  /**
   * Validation error response (422)
   */
  static validationError(res, message = 'Validation failed', errors = null) {
    return this.error(res, 422, message, errors);
  }

  /**
   * Too many requests response (429)
   */
  static tooManyRequests(res, message = 'Too many requests') {
    return this.error(res, 429, message);
  }

  /**
   * Internal server error response (500)
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, 500, message);
  }

  /**
   * Paginated response
   */
  static paginated(res, data, pagination, message = 'Success') {
    return this.success(res, 200, message, data, { pagination });
  }
}

export default ApiResponse;
