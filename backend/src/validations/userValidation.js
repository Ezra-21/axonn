/**
 * User Validation Schemas
 * Joi schemas for user-related requests
 */

import Joi from 'joi';

// Update profile validation
const updateProfileSchema = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
    lastName: Joi.string().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number',
      }),
  }),
};

// Create address validation
const createAddressSchema = {
  body: Joi.object({
    street: Joi.string().min(5).max(200).required().messages({
      'string.min': 'Street address must be at least 5 characters',
      'string.max': 'Street address cannot exceed 200 characters',
      'any.required': 'Street address is required',
    }),
    city: Joi.string().min(2).max(100).required().messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 100 characters',
      'any.required': 'City is required',
    }),
    state: Joi.string().min(2).max(100).required().messages({
      'string.min': 'State must be at least 2 characters',
      'string.max': 'State cannot exceed 100 characters',
      'any.required': 'State is required',
    }),
    postalCode: Joi.string().min(2).max(20).required().messages({
      'string.min': 'Postal code must be at least 2 characters',
      'string.max': 'Postal code cannot exceed 20 characters',
      'any.required': 'Postal code is required',
    }),
    country: Joi.string().min(2).max(100).default('Ethiopia').messages({
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country cannot exceed 100 characters',
    }),
    isDefault: Joi.boolean().default(false),
  }),
};

// Update address validation
const updateAddressSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid address ID',
      'any.required': 'Address ID is required',
    }),
  }),
  body: Joi.object({
    street: Joi.string().min(5).max(200).optional().messages({
      'string.min': 'Street address must be at least 5 characters',
      'string.max': 'Street address cannot exceed 200 characters',
    }),
    city: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City cannot exceed 100 characters',
    }),
    state: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'State must be at least 2 characters',
      'string.max': 'State cannot exceed 100 characters',
    }),
    postalCode: Joi.string().min(2).max(20).optional().messages({
      'string.min': 'Postal code must be at least 2 characters',
      'string.max': 'Postal code cannot exceed 20 characters',
    }),
    country: Joi.string().min(2).max(100).optional().messages({
      'string.min': 'Country must be at least 2 characters',
      'string.max': 'Country cannot exceed 100 characters',
    }),
    isDefault: Joi.boolean().optional(),
  }),
};

// ID parameter validation
const idParamSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
  }),
};

// Admin update user validation
const adminUpdateUserSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid user ID',
      'any.required': 'User ID is required',
    }),
  }),
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .allow('')
      .optional(),
    role: Joi.string().valid('USER', 'ADMIN', 'SUPER_ADMIN').optional(),
    isActive: Joi.boolean().optional(),
    emailVerified: Joi.boolean().optional(),
  }),
};

// Query validation for user listing
const userListQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    role: Joi.string().valid('USER', 'ADMIN', 'SUPER_ADMIN').optional(),
    isActive: Joi.boolean().optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'firstName', 'lastName', 'email')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

export {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  idParamSchema,
  adminUpdateUserSchema,
  userListQuerySchema,
};
