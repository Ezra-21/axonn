/**
 * User Controller
 * Handles user profile and address HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as userService from '../../services/userService.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  ApiResponse.success(res, 200, 'Profile retrieved successfully', { user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.PROFILE_UPDATED, { user });
});

/**
 * @desc    Update user avatar
 * @route   PUT /api/users/avatar
 * @access  Private
 */
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, 'No image file provided');
  }

  const user = await userService.updateAvatar(req.user.id, req.file.path);
  ApiResponse.success(res, 200, 'Avatar updated successfully', { user });
});

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await userService.getAddresses(req.user.id);
  ApiResponse.success(res, 200, 'Addresses retrieved successfully', { addresses });
});

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
const addAddress = asyncHandler(async (req, res) => {
  const address = await userService.addAddress(req.user.id, req.body);
  ApiResponse.created(res, 'Address added successfully', { address });
});

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
const updateAddress = asyncHandler(async (req, res) => {
  const address = await userService.updateAddress(
    req.user.id,
    req.params.id,
    req.body,
  );
  ApiResponse.success(res, 200, 'Address updated successfully', { address });
});

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
  await userService.deleteAddress(req.user.id, req.params.id);
  ApiResponse.success(res, 200, 'Address deleted successfully');
});

export {
  getProfile,
  updateProfile,
  updateAvatar,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
