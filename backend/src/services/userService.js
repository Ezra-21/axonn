/**
 * User Service
 * Business logic for user operations
 */

import { prisma } from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { buildPaginationMeta, parsePaginationParams, parseSortParams } from '../utils/pagination.js';

/**
 * Get user profile
 * @param {string} user_id - User ID
 * @returns {Object} User profile
 */
const getProfile = async (user_id) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      avatar: true,
      role: true,
      email_verified: true,
      created_at: true,
      addresses: {
        orderBy: { is_default: 'desc' },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

/**
 * Update user profile
 * @param {string} user_id - User ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated user
 */
const updateProfile = async (user_id, updateData) => {
  const user = await prisma.users.update({
    where: { id: user_id },
    data: updateData,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      avatar: true,
      role: true,
      updated_at: true,
    },
  });

  return user;
};

/**
 * Update user avatar
 * @param {string} user_id - User ID
 * @param {string} avatarUrl - Avatar URL
 * @returns {Object} Updated user
 */
const updateAvatar = async (user_id, avatarUrl) => {
  const user = await prisma.users.update({
    where: { id: user_id },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      avatar: true,
    },
  });

  return user;
};

/**
 * Add user address
 * @param {string} user_id - User ID
 * @param {Object} addressData - Address data
 * @returns {Object} Created address
 */
const addAddress = async (user_id, addressData) => {
  // If this is the first address or set as default, update other addresses
  if (addressData.is_default) {
    await prisma.addresses.updateMany({
      where: { user_id, is_default: true },
      data: { is_default: false },
    });
  }

  const address = await prisma.addresses.create({
    data: {
      ...addressData,
      user_id,
    },
  });

  return address;
};

/**
 * Update user address
 * @param {string} user_id - User ID
 * @param {string} address_id - Address ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated address
 */
const updateAddress = async (user_id, address_id, updateData) => {
  // Check if address belongs to user
  const existingAddress = await prisma.addresses.findFirst({
    where: { id: address_id, user_id },
  });

  if (!existingAddress) {
    throw ApiError.notFound('Address not found');
  }

  // If setting as default, update other addresses
  if (updateData.is_default) {
    await prisma.addresses.updateMany({
      where: { user_id, is_default: true, NOT: { id: address_id } },
      data: { is_default: false },
    });
  }

  const address = await prisma.addresses.update({
    where: { id: address_id },
    data: updateData,
  });

  return address;
};

/**
 * Delete user address
 * @param {string} user_id - User ID
 * @param {string} address_id - Address ID
 */
const deleteAddress = async (user_id, address_id) => {
  const address = await prisma.addresses.findFirst({
    where: { id: address_id, user_id },
  });

  if (!address) {
    throw ApiError.notFound('Address not found');
  }

  await prisma.addresses.delete({
    where: { id: address_id },
  });
};

/**
 * Get user addresses
 * @param {string} user_id - User ID
 * @returns {Array} User addresses
 */
const getAddresses = async (user_id) => {
  const addresses = await prisma.addresses.findMany({
    where: { user_id },
    orderBy: { is_default: 'desc' },
  });

  return addresses;
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Get all users (Admin)
 * @param {Object} query - Query parameters
 * @returns {Object} Users with pagination
 */
const getAllUsers = async (query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  const sortBy = parseSortParams(
    query,
    { created_at: 'created_at', first_name: 'first_name', last_name: 'last_name', email: 'email' },
    'created_at',
    'desc'
  );

  // Build filters
  const where = {};

  if (query.search) {
    where.OR = [
      { email: { contains: query.search, mode: 'insensitive' } },
      { first_name: { contains: query.search, mode: 'insensitive' } },
      { last_name: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.is_active !== undefined) {
    where.is_active = query.is_active;
  }

  // Get users and total count
  const [users, totalItems] = await Promise.all([
    prisma.users.findMany({
      where,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        avatar: true,
        role: true,
        is_active: true,
        email_verified: true,
        created_at: true,
        _count: {
          select: { orders: true },
        },
      },
      skip,
      take: limit,
      orderBy: sortBy,
    }),
    prisma.users.count({ where }),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return { users, pagination };
};

/**
 * Get user by ID (Admin)
 * @param {string} user_id - User ID
 * @returns {Object} User
 */
const getUserById = async (user_id) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      avatar: true,
      role: true,
      is_active: true,
      email_verified: true,
      created_at: true,
      updated_at: true,
      addresses: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
};

/**
 * Update user (Admin)
 * @param {string} user_id - User ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated user
 */
const adminUpdateUser = async (user_id, updateData) => {
  const existingUser = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!existingUser) {
    throw ApiError.notFound('User not found');
  }

  const user = await prisma.users.update({
    where: { id: user_id },
    data: updateData,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      role: true,
      is_active: true,
      email_verified: true,
      updated_at: true,
    },
  });

  return user;
};

/**
 * Delete user (Admin)
 * @param {string} user_id - User ID
 */
const deleteUser = async (user_id) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  await prisma.users.delete({
    where: { id: user_id },
  });
};

export {
  getProfile,
  updateProfile,
  updateAvatar,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses,
  getAllUsers,
  getUserById,
  adminUpdateUser,
  deleteUser,
};
