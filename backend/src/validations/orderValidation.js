/**
 * Order Validation Schemas
 * Joi schemas for order-related requests
 */

import Joi from 'joi';

// Create order validation
const createOrderSchema = {
  body: Joi.object({
    addressId: Joi.string().uuid().optional().messages({
      'string.guid': 'Invalid address ID',
    }),
    shippingAddress: Joi.object({
      street: Joi.string().min(5).max(200).required(),
      city: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(2).max(100).required(),
      postalCode: Joi.string().min(2).max(20).required(),
      country: Joi.string().min(2).max(100).default('Ethiopia'),
    }).optional(),
    paymentMethod: Joi.string()
      .valid('STRIPE', 'CASH_ON_DELIVERY', 'BANK_TRANSFER', 'MOBILE_PAYMENT')
      .default('CASH_ON_DELIVERY'),
    notes: Joi.string().max(500).optional(),
  })
    .or('addressId', 'shippingAddress')
    .messages({
      'object.missing': 'Either addressId or shippingAddress is required',
    }),
};

// Update order status validation (Admin)
const updateOrderStatusSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid order ID',
      'any.required': 'Order ID is required',
    }),
  }),
  body: Joi.object({
    status: Joi.string()
      .valid(
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
      )
      .required()
      .messages({
        'any.required': 'Status is required',
        'any.only': 'Invalid order status',
      }),
    notes: Joi.string().max(500).optional(),
  }),
};

// Update payment status validation (Admin)
const updatePaymentStatusSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid order ID',
      'any.required': 'Order ID is required',
    }),
  }),
  body: Joi.object({
    paymentStatus: Joi.string()
      .valid('PENDING', 'PAID', 'FAILED', 'REFUNDED')
      .required()
      .messages({
        'any.required': 'Payment status is required',
        'any.only': 'Invalid payment status',
      }),
  }),
};

// Order ID parameter validation
const orderIdSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid order ID',
      'any.required': 'Order ID is required',
    }),
  }),
};

// Order query validation
const orderQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid(
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
      )
      .optional(),
    paymentStatus: Joi.string()
      .valid('PENDING', 'PAID', 'FAILED', 'REFUNDED')
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'totalAmount', 'status')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

// Admin order query validation (with additional filters)
const adminOrderQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    userId: Joi.string().uuid().optional(),
    status: Joi.string()
      .valid(
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
      )
      .optional(),
    paymentStatus: Joi.string()
      .valid('PENDING', 'PAID', 'FAILED', 'REFUNDED')
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
    minAmount: Joi.number().min(0).optional(),
    maxAmount: Joi.number().min(0).optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'totalAmount', 'status', 'orderNumber')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

export {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  orderIdSchema,
  orderQuerySchema,
  adminOrderQuerySchema,
};
