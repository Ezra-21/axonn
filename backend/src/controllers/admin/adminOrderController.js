/**
 * Admin Order Controller
 * Handles order management HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as orderService from '../../services/orderService.js';

/**
 * @desc    Get all orders
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  ApiResponse.paginated(res, { orders }, pagination, 'Orders retrieved');
});

/**
 * @desc    Get order by ID
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin)
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  ApiResponse.success(res, 200, 'Order retrieved', { order });
});

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private (Admin)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status, notes);
  ApiResponse.success(res, 200, 'Order status updated', { order });
});

/**
 * @desc    Update payment status
 * @route   PUT /api/admin/orders/:id/payment-status
 * @access  Private (Admin)
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { payment_status } = req.body;
  const order = await orderService.updatePaymentStatus(req.params.id, payment_status);
  ApiResponse.success(res, 200, 'Payment status updated', { order });
});

export {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};
