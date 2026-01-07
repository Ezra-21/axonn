/**
 * Request Validation Middleware
 * Validates request body, params, and query using Joi schemas
 */

import ApiError from '../utils/apiError.js';

/**
 * Validate request against Joi schema
 * @param {Object} schema - Joi schema object with body, params, query
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Include all errors
      allowUnknown: true, // Ignore unknown props
      stripUnknown: true, // Remove unknown props
    };

    const errors = [];

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body, validationOptions);
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
            location: 'body',
          })),
        );
      } else {
        req.body = value;
      }
    }

    // Validate params
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params, validationOptions);
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
            location: 'params',
          })),
        );
      } else {
        req.params = value;
      }
    }

    // Validate query
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query, validationOptions);
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message.replace(/"/g, ''),
            location: 'query',
          })),
        );
      } else {
        req.query = value;
      }
    }

    if (errors.length > 0) {
      throw ApiError.validation('Validation failed', errors);
    }

    next();
  };
};

export default validate;

// strips unknown fields before passing to controllers

// Joi options: abortEarly: false to collect all validation errors

// product price must be positive and have at most 2 decimal places

// order quantity must be between 1 and 99

// payment amount validated server-side – never trust client total

// test coverage: empty body, missing fields, wrong types

// file upload validation: reject files over 5 MB