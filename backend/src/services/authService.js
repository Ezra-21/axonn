/**
 * Authentication Service
 * Business logic for authentication operations
 */

import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { generateTokens, verifyRefreshToken } from '../config/jwt.js';
import ApiError from '../utils/apiError.js';
import { ROLES } from '../utils/constants.js';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and tokens
 */
const register = async (userData) => {
  const { email, password, first_name, last_name, phone } = userData;

  // Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Use transaction to ensure all operations succeed or fail together
  const user = await prisma.$transaction(async (tx) => {
    // Create user
    const newUser = await tx.users.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        role: ROLES.USER,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    // Create empty cart for user (use upsert to handle edge cases)
    await tx.carts.upsert({
      where: { user_id: newUser.id },
      create: { user_id: newUser.id },
      update: {}, // Do nothing if already exists
    });

    // Create empty wishlist for user (use upsert to handle edge cases)
    await tx.wishlists.upsert({
      where: { user_id: newUser.id },
      create: { user_id: newUser.id },
      update: {}, // Do nothing if already exists
    });

    return newUser;
  });

  // Generate tokens
  const tokens = generateTokens(user);

  return { user, ...tokens };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User and tokens
 */
const login = async (email, password) => {
  // Find user
  const user = await prisma.users.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.is_active) {
    throw ApiError.unauthorized('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, ...tokens };
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New tokens
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        is_active: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.is_active) {
      throw ApiError.unauthorized('Account is deactivated');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    return tokens;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Refresh token has expired');
    }
    throw ApiError.unauthorized('Invalid refresh token');
  }
};

/**
 * Change password
 * @param {string} user_id - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 */
const changePassword = async (user_id, currentPassword, newPassword) => {
  const user = await prisma.users.findUnique({
    where: { id: user_id },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.users.update({
    where: { id: user_id },
    data: { password: hashedPassword },
  });
};

/**
 * Register admin user (Super Admin only)
 * @param {Object} adminData - Admin registration data
 * @returns {Object} Admin user
 */
const registerAdmin = async (adminData) => {
  const { email, password, first_name, last_name, role = ROLES.ADMIN } = adminData;

  // Check if user exists
  const existingUser = await prisma.users.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin user
  const admin = await prisma.users.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      first_name,
      last_name,
      role,
      email_verified: true,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      role: true,
      created_at: true,
    },
  });

  return admin;
};

export {
  register,
  login,
  refreshAccessToken,
  changePassword,
  registerAdmin,
};
