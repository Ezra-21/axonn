/**
 * Admin Authentication Controller
 * Handles admin authentication HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as authService from '../../services/authService.js';
import { SUCCESS_MESSAGES, ROLES } from '../../utils/constants.js';

/**
 * @desc    Admin login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  // Check if user is admin
  if (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN) {
    return ApiResponse.forbidden(res, 'Admin access required');
  }

  ApiResponse.success(res, 200, SUCCESS_MESSAGES.LOGIN, {
    user,
    accessToken,
    refreshToken,
  });
});

/**
 * @desc    Register new admin (Super Admin only)
 * @route   POST /api/admin/auth/register
 * @access  Private (Super Admin)
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.registerAdmin(req.body);
  ApiResponse.created(res, 'Admin created successfully', { admin });
});

/**
 * @desc    Get current admin
 * @route   GET /api/admin/auth/me
 * @access  Private (Admin)
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  ApiResponse.success(res, 200, 'Admin profile retrieved', { admin: req.user });
});

export {
  adminLogin,
  registerAdmin,
  getAdminProfile,
};
