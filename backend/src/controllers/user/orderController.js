/**
 * Order Controller (User)
 * Handles user order HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as orderService from '../../services/orderService.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  ApiResponse.created(res, SUCCESS_MESSAGES.ORDER_PLACED, { order });
});

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getUserOrders(
    req.user.id,
    req.query,
  );
  ApiResponse.paginated(res, { orders }, pagination, 'Orders retrieved successfully');
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  ApiResponse.success(res, 200, 'Order retrieved successfully', { order });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user.id);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.ORDER_CANCELLED, { order });
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
