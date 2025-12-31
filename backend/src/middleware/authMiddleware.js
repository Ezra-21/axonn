/**
 * Authentication Middleware
 * Protects routes requiring authentication
 */

import { verifyAccessToken } from '../config/jwt.js';
import { prisma } from '../config/database.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

// Debug: Check if prisma is loaded
console.log('🔍 authMiddleware - prisma loaded:', prisma ? 'YES' : 'NO', typeof prisma);

/**
 * Protect routes - Require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (if using cookies)
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorized('Access denied. No token provided.');
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Debug: Check prisma at runtime
    console.log('🔍 Runtime prisma check:', prisma ? 'EXISTS' : 'UNDEFINED', typeof prisma);
    if (!prisma) {
      console.error('❌ PRISMA IS UNDEFINED - reimporting...');
      const { prisma: reimportedPrisma } = await import('../config/database.js');
      console.log('🔍 Reimported prisma:', reimportedPrisma ? 'EXISTS' : 'UNDEFINED');
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
        avatar: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.is_active) {
      throw ApiError.unauthorized('User account is deactivated');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    throw error;
  }
});

/**
 * Optional authentication - Attach user if token provided, but don't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        is_active: true,
      },
    });

    if (user && user.is_active) {
      req.user = user;
    }
  } catch (error) {
    // Token invalid, continue without user
  }

  next();
});

export {
  protect,
  optionalAuth,
};

// refresh token rotation not yet implemented

// bearer token extracted from Authorization header

// attach decoded user payload to req.user for downstream handlers

// req.user.id used to scope order and cart queries

// test: mock req.user in unit tests with jest.fn()