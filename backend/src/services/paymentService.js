/**
 * Payment Service
 * Business logic for payment operations with Stripe integration
 */

import Stripe from 'stripe';
import { prisma } from '../config/database.js';
import env from '../config/env.js';
import ApiError from '../utils/apiError.js';

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

/**
 * Create payment intent for an order
 * @param {string} order_id - Order ID
 * @param {string} user_id - User ID
 * @returns {Object} Payment intent details
 */
const createPaymentIntent = async (order_id, user_id) => {
  // Get order details
  const order = await prisma.orders.findFirst({
    where: { id: order_id, user_id },
    include: {
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Check if order already has a payment
  const existingPayment = await prisma.payments.findUnique({
    where: { order_id },
  });

  if (existingPayment && existingPayment.status === 'PAID') {
    throw ApiError.badRequest('Order has already been paid');
  }

  // Create or update payment intent
  let paymentIntent;
  let payment;

  if (existingPayment && existingPayment.stripePaymentIntentId) {
    // Retrieve existing payment intent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(
        existingPayment.stripePaymentIntentId,
      );

      // Update amount if changed
      if (paymentIntent.amount !== Math.round(parseFloat(order.total_amount) * 100)) {
        paymentIntent = await stripe.paymentIntents.update(
          existingPayment.stripePaymentIntentId,
          {
            amount: Math.round(parseFloat(order.total_amount) * 100),
          },
        );
      }

      payment = existingPayment;
    } catch (error) {
      // If payment intent doesn't exist, create new one
      paymentIntent = await createNewPaymentIntent(order);
      payment = await updatePayment(existingPayment.id, paymentIntent);
    }
  } else {
    // Create new payment intent
    paymentIntent = await createNewPaymentIntent(order);

    // Create payment record
    payment = await prisma.payments.create({
      data: {
        order_id: order.id,
        user_id: order.user_id,
        amount: order.total_amount,
        currency: env.STRIPE_CURRENCY,
        payment_method: 'STRIPE',
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        metadata: {
          order_number: order.order_number,
          customerEmail: order.user.email,
        },
      },
    });
  }

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: order.total_amount,
    currency: env.STRIPE_CURRENCY,
    paymentId: payment.id,
  };
};

/**
 * Create new Stripe payment intent
 * @param {Object} order - Order object
 * @returns {Object} Stripe payment intent
 */
const createNewPaymentIntent = async (order) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(order.total_amount) * 100), // Convert to cents
    currency: env.STRIPE_CURRENCY,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
    },
    description: `Payment for order ${order.order_number}`,
    receipt_email: order.user.email,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

/**
 * Update payment record
 * @param {string} paymentId - Payment ID
 * @param {Object} paymentIntent - Stripe payment intent
 * @returns {Object} Updated payment
 */
const updatePayment = async (paymentId, paymentIntent) => {
  return await prisma.payments.update({
    where: { id: paymentId },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret,
      status: 'PENDING',
    },
  });
};

/**
 * Confirm payment (webhook handler)
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Object} Updated payment
 */
const confirmPayment = async (paymentIntentId) => {
  // Find payment by stripe payment intent ID
  const payment = await prisma.payments.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { order: true },
  });

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  // Update payment and order status
  await prisma.$transaction([
    prisma.payments.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    }),
    prisma.orders.update({
      where: { id: payment.order_id },
      data: {
        payment_status: 'PAID',
        status: 'CONFIRMED',
      },
    }),
  ]);

  return payment;
};

/**
 * Handle payment failure
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {string} failureReason - Reason for failure
 * @returns {Object} Updated payment
 */
const handlePaymentFailure = async (paymentIntentId, failureReason) => {
  const payment = await prisma.payments.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  // Update payment and order status
  await prisma.$transaction([
    prisma.payments.update({
      where: { id: payment.id },
      data: {
        status: 'FAILED',
        failureReason,
      },
    }),
    prisma.orders.update({
      where: { id: payment.order_id },
      data: {
        payment_status: 'FAILED',
      },
    }),
  ]);

  return payment;
};

/**
 * Refund payment
 * @param {string} order_id - Order ID
 * @param {number} amount - Amount to refund (optional, full refund if not specified)
 * @param {string} reason - Refund reason
 * @returns {Object} Updated payment
 */
const refundPayment = async (order_id, amount = null, reason = null) => {
  const payment = await prisma.payments.findUnique({
    where: { order_id },
    include: { order: true },
  });

  if (!payment) {
    throw ApiError.notFound('Payment not found for this order');
  }

  if (payment.status !== 'PAID') {
    throw ApiError.badRequest('Cannot refund unpaid order');
  }

  if (!payment.stripePaymentIntentId) {
    throw ApiError.badRequest('No payment intent found for this payment');
  }

  // Create refund in Stripe
  const refundAmount = amount
    ? Math.round(parseFloat(amount) * 100)
    : Math.round(parseFloat(payment.amount) * 100);

  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: refundAmount,
    reason: reason || 'requested_by_customer',
    metadata: {
      order_id: payment.order_id,
      order_number: payment.order.order_number,
    },
  });

  // Update payment and order
  await prisma.$transaction([
    prisma.payments.update({
      where: { id: payment.id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        refundAmount: amount || payment.amount,
        metadata: {
          ...payment.metadata,
          refundId: refund.id,
          refundReason: reason,
        },
      },
    }),
    prisma.orders.update({
      where: { id: payment.order_id },
      data: {
        payment_status: 'REFUNDED',
        status: 'REFUNDED',
      },
    }),
  ]);

  return prisma.payments.findUnique({
    where: { id: payment.id },
    include: { order: true },
  });
};

/**
 * Get payment by order ID
 * @param {string} order_id - Order ID
 * @param {string} user_id - User ID (optional, for ownership check)
 * @returns {Object} Payment
 */
const getPaymentByOrderId = async (order_id, user_id = null) => {
  const where = { order_id };

  const payment = await prisma.payments.findUnique({
    where,
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  // Check ownership if user_id provided
  if (user_id && payment.order.user_id !== user_id) {
    throw ApiError.forbidden('You do not have access to this payment');
  }

  return payment;
};

/**
 * Get payment by ID
 * @param {string} paymentId - Payment ID
 * @param {string} user_id - User ID (optional, for ownership check)
 * @returns {Object} Payment
 */
const getPaymentById = async (paymentId, user_id = null) => {
  const payment = await prisma.payments.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw ApiError.notFound('Payment not found');
  }

  // Check ownership if user_id provided
  if (user_id && payment.order.user_id !== user_id) {
    throw ApiError.forbidden('You do not have access to this payment');
  }

  return payment;
};

/**
 * Verify webhook signature
 * @param {string} payload - Request payload
 * @param {string} signature - Stripe signature
 * @returns {Object} Stripe event
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    throw ApiError.badRequest(`Webhook signature verification failed: ${error.message}`);
  }
};

/**
 * Get Stripe publishable key
 * @returns {Object} Publishable key
 */
const getPublishableKey = () => {
  return {
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  };
};

export {
  createPaymentIntent,
  confirmPayment,
  handlePaymentFailure,
  refundPayment,
  getPaymentByOrderId,
  getPaymentById,
  verifyWebhookSignature,
  getPublishableKey,
};
