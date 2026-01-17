/**
 * Cart Validation Schemas
 * Joi schemas for cart-related requests
 */

import Joi from 'joi';

// Add item to cart validation
const addToCartSchema = {
  body: Joi.object({
    productId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid product ID',
      'any.required': 'Product ID is required',
    }),
    quantity: Joi.number().integer().min(1).max(100).default(1).messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 100',
    }),
  }),
};

// Update cart item validation
const updateCartItemSchema = {
  params: Joi.object({
    itemId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid cart item ID',
      'any.required': 'Cart item ID is required',
    }),
  }),
  body: Joi.object({
    quantity: Joi.number().integer().min(1).max(100).required().messages({
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 100',
      'any.required': 'Quantity is required',
    }),
  }),
};

// Remove cart item validation
const removeCartItemSchema = {
  params: Joi.object({
    itemId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid cart item ID',
      'any.required': 'Cart item ID is required',
    }),
  }),
};

// Bulk update cart validation
const bulkUpdateCartSchema = {
  body: Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().uuid().required(),
          quantity: Joi.number().integer().min(1).max(100).required(),
        }),
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one item is required',
        'any.required': 'Items array is required',
      }),
  }),
};

export {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  bulkUpdateCartSchema,
};
