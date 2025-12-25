/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors automatically
 */

/**
 * Wraps an async function and forwards errors to Express error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
