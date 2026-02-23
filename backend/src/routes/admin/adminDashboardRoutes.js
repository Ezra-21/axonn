/**
 * Admin Dashboard Routes
 */

import express from 'express';
const router = express.Router();

import * as adminDashboardController from '../../controllers/admin/adminDashboardController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';

// All routes require admin authentication
router.use(protect, requireAdmin);

// Dashboard routes

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/', adminDashboardController.getDashboardStats);

/**
 * @swagger
 * /admin/dashboard/sales:
 *   get:
 *     summary: Get sales statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Sales stats retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/sales', adminDashboardController.getSalesStats);

/**
 * @swagger
 * /admin/dashboard/orders:
 *   get:
 *     summary: Get order statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order stats retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/orders', adminDashboardController.getOrderStats);

/**
 * @swagger
 * /admin/dashboard/categories:
 *   get:
 *     summary: Get category statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category stats retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/categories', adminDashboardController.getCategoryStats);

export default router;
