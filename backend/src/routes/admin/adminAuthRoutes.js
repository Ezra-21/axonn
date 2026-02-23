/**
 * Admin Authentication Routes
 */

import express from 'express';
const router = express.Router();

import * as adminAuthController from '../../controllers/admin/adminAuthController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin, requireSuperAdmin } from '../../middleware/adminMiddleware.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import validate from '../../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../../validations/authValidation.js';

// Public admin routes

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin - Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: admin@axon.com
 *             password: Admin123!@#
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials or not an admin
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  adminAuthController.adminLogin,
);

// Protected admin routes

/**
 * @swagger
 * /admin/auth/me:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admin - Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/me',
  protect,
  requireAdmin,
  adminAuthController.getAdminProfile,
);

// Super admin only

/**
 * @swagger
 * /admin/auth/register:
 *   post:
 *     summary: Register new admin (Super Admin only)
 *     tags: [Admin - Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/RegisterRequest'
 *               - type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, SUPER_ADMIN]
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/register',
  protect,
  requireSuperAdmin,
  validate(registerSchema),
  adminAuthController.registerAdmin,
);

export default router;
