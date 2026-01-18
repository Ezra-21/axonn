/**
 * Payment Validation Schemas
 * Validation rules for payment operations
 */

import Joi from 'joi';

/**
 * Create payment intent validation
 */
const createPaymentIntentSchema = Joi.object({
  body: Joi.object({
    orderId: Joi.string().uuid().required().messages({
      'string.guid': 'Order ID must be a valid UUID',
      'any.required': 'Order ID is required',
    }),
  }),
});

/**
 * Payment ID param validation
 */
const paymentIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Payment ID must be a valid UUID',
      'any.required': 'Payment ID is required',
    }),
  }),
});

/**
 * Order ID param validation
 */
const orderIdParamSchema = Joi.object({
  params: Joi.object({
    orderId: Joi.string().uuid().required().messages({
      'string.guid': 'Order ID must be a valid UUID',
      'any.required': 'Order ID is required',
    }),
  }),
});

/**
 * Refund payment validation
 */
const refundPaymentSchema = Joi.object({
  params: Joi.object({
    orderId: Joi.string().uuid().required().messages({
      'string.guid': 'Order ID must be a valid UUID',
      'any.required': 'Order ID is required',
    }),
  }),
  body: Joi.object({
    amount: Joi.number().positive().optional().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
    }),
    reason: Joi.string().max(500).optional().messages({
      'string.max': 'Reason cannot exceed 500 characters',
    }),
  }),
});

export {
  createPaymentIntentSchema,
  paymentIdSchema,
  orderIdParamSchema,
  refundPaymentSchema,
};
