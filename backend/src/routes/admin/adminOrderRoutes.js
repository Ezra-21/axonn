/**
 * Admin Order Routes
 */

import express from 'express';
const router = express.Router();

import * as adminOrderController from '../../controllers/admin/adminOrderController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import validate from '../../middleware/validateRequest.js';
import {
  orderIdSchema,
  adminOrderQuerySchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from '../../validations/orderValidation.js';

// All routes require admin authentication
router.use(protect, requireAdmin);

// Order routes

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *       - name: paymentStatus
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, FAILED, REFUNDED]
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
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  validate(adminOrderQuerySchema),
  adminOrderController.getAllOrders,
);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     summary: Get order by ID (Admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  validate(orderIdSchema),
  adminOrderController.getOrderById,
);

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id/status',
  validate(updateOrderStatusSchema),
  adminOrderController.updateOrderStatus,
);

/**
 * @swagger
 * /admin/orders/{id}/payment-status:
 *   put:
 *     summary: Update payment status
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, PAID, FAILED, REFUNDED]
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id/payment-status',
  validate(updatePaymentStatusSchema),
  adminOrderController.updatePaymentStatus,
);

export default router;
