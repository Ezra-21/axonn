/**
 * Admin Dashboard Controller
 * Handles dashboard statistics HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as dashboardService from '../../services/dashboardService.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  ApiResponse.success(res, 200, 'Dashboard statistics retrieved', { stats });
});

/**
 * @desc    Get sales statistics
 * @route   GET /api/admin/dashboard/sales
 * @access  Private (Admin)
 */
const getSalesStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const sales = await dashboardService.getSalesStats(start, end);
  ApiResponse.success(res, 200, 'Sales statistics retrieved', { sales });
});

/**
 * @desc    Get order statistics by status
 * @route   GET /api/admin/dashboard/orders
 * @access  Private (Admin)
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getOrderStats();
  ApiResponse.success(res, 200, 'Order statistics retrieved', { stats });
});

/**
 * @desc    Get category statistics
 * @route   GET /api/admin/dashboard/categories
 * @access  Private (Admin)
 */
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getCategoryStats();
  ApiResponse.success(res, 200, 'Category statistics retrieved', { stats });
});

export {
  getDashboardStats,
  getSalesStats,
  getOrderStats,
  getCategoryStats,
};
