/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as authService from '../../services/authService.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  ApiResponse.created(res, 'Registration successful', {
    user,
    accessToken,
    refreshToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  ApiResponse.success(res, 200, SUCCESS_MESSAGES.LOGIN, {
    user,
    accessToken,
    refreshToken,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  const tokens = await authService.refreshAccessToken(token);

  ApiResponse.success(res, 200, 'Token refreshed successfully', tokens);
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  ApiResponse.success(res, 200, 'User retrieved successfully', { user: req.user });
});

/**
 * @desc    Change password
 * @route   POST /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);

  ApiResponse.success(res, 200, SUCCESS_MESSAGES.PASSWORD_CHANGED);
});

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // This endpoint can be used for additional cleanup if needed
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.LOGOUT);
});

export {
  register,
  login,
  refreshToken,
  getMe,
  changePassword,
  logout,
};
