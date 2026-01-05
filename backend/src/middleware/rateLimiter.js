/**
 * Rate Limiter Middleware
 * Prevents abuse by limiting request rates
 */

import rateLimit from 'express-rate-limit';
import ApiResponse from '../utils/apiResponse.js';
import env from '../config/env.js';

/**
 * Default rate limiter
 * 1000 requests per 15 minutes (generous for development)
 */
const defaultLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 1000, // Very generous for development
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.tooManyRequests(res, 'Too many requests, please try again later');
  },
});

/**
 * Rate limiter for auth routes
 * 100 requests per 15 minutes (generous for development)
 * In production, reduce this to 10-20
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Allow 100 attempts per 15 minutes for development
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req, res) => {
    ApiResponse.tooManyRequests(
      res,
      'Too many authentication attempts, please try again later',
    );
  },
});

/**
 * API rate limiter
 * 500 requests per minute (generous for development)
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // Very generous for development
  message: {
    success: false,
    message: 'API rate limit exceeded',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.tooManyRequests(res, 'API rate limit exceeded');
  },
});

/**
 * Create custom rate limiter
 * @param {Object} options - Rate limiter options
 */
const createLimiter = (options) => {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      ApiResponse.tooManyRequests(
        res,
        options.message || 'Too many requests, please try again later',
      );
    },
    ...options,
  });
};

export {
  defaultLimiter,
  authLimiter,
  apiLimiter,
  createLimiter,
};

// global rate limit: 100 req / 15 min per IP

// stricter limit for auth endpoints: 10 req / 15 min

// fix: skip rate limiter for internal health check route

// upload endpoint: 20 req / hour to prevent abuse