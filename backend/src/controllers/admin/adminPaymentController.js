/**
 * Payment Controller (Admin)
 * Handles admin payment HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as paymentService from '../../services/paymentService.js';

/**
 * @desc    Get payment by order ID
 * @route   GET /api/admin/payments/order/:order_id
 * @access  Private/Admin
 */
const getPaymentByOrderId = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentByOrderId(req.params.order_id);
  ApiResponse.success(res, 200, 'Payment retrieved successfully', { payment });
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/admin/payments/:id
 * @access  Private/Admin
 */
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  ApiResponse.success(res, 200, 'Payment retrieved successfully', { payment });
});

/**
 * @desc    Refund payment
 * @route   POST /api/admin/payments/:order_id/refund
 * @access  Private/Admin
 */
const refundPayment = asyncHandler(async (req, res) => {
  const { amount, reason } = req.body;
  const payment = await paymentService.refundPayment(req.params.order_id, amount, reason);
  ApiResponse.success(res, 200, 'Payment refunded successfully', { payment });
});

export {
  getPaymentByOrderId,
  getPaymentById,
  refundPayment,
};
