/**
 * Payment Routes (Admin)
 * Admin payment management endpoints
 */

import express from 'express';
const router = express.Router();

import * as adminPaymentController from '../../controllers/admin/adminPaymentController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import validate from '../../middleware/validateRequest.js';
import {
  paymentIdSchema,
  orderIdParamSchema,
  refundPaymentSchema,
} from '../../validations/paymentValidation.js';

// All routes require authentication and admin role
router.use(protect, requireAdmin);

/**
 * @swagger
 * /admin/payments/order/{orderId}:
 *   get:
 *     summary: Get payment by order ID (Admin)
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 */
router.get(
  '/order/:orderId',
  validate(orderIdParamSchema),
  adminPaymentController.getPaymentByOrderId
);

/**
 * @swagger
 * /admin/payments/{id}:
 *   get:
 *     summary: Get payment by ID (Admin)
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 */
router.get('/:id', validate(paymentIdSchema), adminPaymentController.getPaymentById);

/**
 * @swagger
 * /admin/payments/{orderId}/refund:
 *   post:
 *     summary: Refund payment
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to refund (optional, full refund if not specified)
 *               reason:
 *                 type: string
 *                 maxLength: 500
 *                 description: Reason for refund
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *       400:
 *         description: Cannot refund unpaid order
 *       404:
 *         description: Payment not found
 */
router.post(
  '/:orderId/refund',
  validate(refundPaymentSchema),
  adminPaymentController.refundPayment
);

export default router;
