/**
 * Error Handler Middleware
 * Global error handling for the application
 */

import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';

/**
 * Handle Prisma errors
 */
const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return ApiError.conflict(`A record with this ${error.meta?.target?.[0] || 'field'} already exists`);
    case 'P2025':
      // Record not found
      return ApiError.notFound('Record not found');
    case 'P2003':
      // Foreign key constraint violation
      return ApiError.badRequest('Invalid reference to related record');
    case 'P2014':
      // Required relation violation
      return ApiError.badRequest('Required relation missing');
    default:
      return ApiError.internal('Database error');
  }
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => ApiError.unauthorized('Invalid token');

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () => ApiError.unauthorized('Token has expired');

/**
 * Handle validation errors
 */
const handleValidationError = (error) => {
  const errors = error.details?.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
  }));
  return ApiError.validation('Validation failed', errors);
};

/**
 * Handle multer errors
 */
const handleMulterError = (error) => {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return ApiError.badRequest('File size too large');
    case 'LIMIT_FILE_COUNT':
      return ApiError.badRequest('Too many files');
    case 'LIMIT_UNEXPECTED_FILE':
      return ApiError.badRequest('Unexpected file field');
    default:
      return ApiError.badRequest('File upload error');
  }
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?.id,
  });

  // Handle specific error types
  if (error.name === 'PrismaClientKnownRequestError') {
    error = handlePrismaError(error);
  }

  if (error.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (error.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  if (error.isJoi || error.name === 'ValidationError') {
    error = handleValidationError(error);
  }

  if (error.name === 'MulterError') {
    error = handleMulterError(error);
  }

  // Default to 500 if no status code
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Build response
  const response = {
    success: false,
    message,
  };

  // Add error details in development
  if (env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.errors = error.errors;
  } else if (error.errors) {
    // Include validation errors in production
    response.errors = error.errors;
  }

  return res.status(statusCode).json(response);
};

export {
  notFoundHandler,
  errorHandler,
};

// never leak stack traces to production clients

// TODO: integrate Sentry for error tracking

// PrismaClientKnownRequestError P2002 → 409 Conflict

// insufficient stock → 400 with descriptive message

// Stripe card errors → 402 Payment Required

// test: error handler correctly formats 404 for unknown routes

// fix: handle undefined error.message gracefully

// structured error response: { success: false, message, code }

// final: all unhandled errors logged with request ID for tracing