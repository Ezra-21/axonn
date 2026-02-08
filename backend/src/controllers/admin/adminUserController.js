/**
 * Admin User Controller
 * Handles user management HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as userService from '../../services/userService.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await userService.getAllUsers(req.query);
  ApiResponse.paginated(res, { users }, pagination, 'Users retrieved');
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, 200, 'User retrieved', { user });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private (Admin)
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.adminUpdateUser(req.params.id, req.body);
  ApiResponse.success(res, 200, 'User updated successfully', { user });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Super Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  ApiResponse.success(res, 200, 'User deleted successfully');
});

/**
 * @desc    Activate/Deactivate user
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { is_active } = req.body;
  const user = await userService.adminUpdateUser(req.params.id, { is_active });
  ApiResponse.success(
    res,
    200,
    `User ${is_active ? 'activated' : 'deactivated'} successfully`,
    { user },
  );
});

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
