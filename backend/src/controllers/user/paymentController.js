/**
 * Payment Controller (User)
 * Handles payment HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as paymentService from '../../services/paymentService.js';

/**
 * @desc    Get Stripe publishable key
 * @route   GET /api/payments/config
 * @access  Public
 */
const getConfig = asyncHandler(async (req, res) => {
  const config = paymentService.getPublishableKey();
  ApiResponse.success(res, 200, 'Configuration retrieved successfully', config);
});

/**
 * @desc    Create payment intent for order
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { order_id } = req.body;
  const paymentIntent = await paymentService.createPaymentIntent(order_id, req.user.id);
  ApiResponse.success(res, 200, 'Payment intent created successfully', { payment: paymentIntent });
});

/**
 * @desc    Get payment by order ID
 * @route   GET /api/payments/order/:order_id
 * @access  Private
 */
const getPaymentByOrderId = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentByOrderId(req.params.order_id, req.user.id);
  ApiResponse.success(res, 200, 'Payment retrieved successfully', { payment });
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id, req.user.id);
  ApiResponse.success(res, 200, 'Payment retrieved successfully', { payment });
});

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/payments/webhook
 * @access  Public (Stripe only)
 */
const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const payload = req.body;

  // Verify webhook signature
  const event = paymentService.verifyWebhookSignature(payload, signature);

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      await paymentService.confirmPayment(event.data.object.id);
      console.log('✅ Payment succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      await paymentService.handlePaymentFailure(
        event.data.object.id,
        event.data.object.last_payment_error?.message || 'Payment failed',
      );
      console.log('❌ Payment failed:', event.data.object.id);
      break;

    case 'payment_intent.canceled':
      await paymentService.handlePaymentFailure(
        event.data.object.id,
        'Payment was canceled',
      );
      console.log('🚫 Payment canceled:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt of the event
  res.json({ received: true });
});

export {
  getConfig,
  createPaymentIntent,
  getPaymentByOrderId,
  getPaymentById,
  handleWebhook,
};
