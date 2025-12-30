/**
 * Admin Middleware
 * Role-based access control for admin routes
 */

import ApiError from '../utils/apiError.js';
import { ROLES } from '../utils/constants.js';

/**
 * Require admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('Admin access required');
  }

  next();
};

/**
 * Require super admin role
 */
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (req.user.role !== ROLES.SUPER_ADMIN) {
    throw ApiError.forbidden('Super admin access required');
  }

  next();
};

/**
 * Require specific roles
 * @param {string[]} roles - Array of allowed roles
 */
const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied. Required roles: ${roles.join(', ')}`,
      );
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 * @param {Function} getResourceUserId - Function to get resource owner ID
 */
const requireOwnerOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    // Admins can access any resource
    if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    try {
      const resourceUserId = await getResourceUserId(req);
      if (resourceUserId !== req.user.id) {
        throw ApiError.forbidden('You can only access your own resources');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export {
  requireAdmin,
  requireSuperAdmin,
  requireRoles,
  requireOwnerOrAdmin,
};

// role check: user must have role === 'ADMIN'

// audit log: admin actions recorded with timestamp + userId