/**
 * Payment Routes (User)
 * Payment processing endpoints
 */

import express from 'express';
const router = express.Router();

import * as paymentController from '../../controllers/user/paymentController.js';
import { protect } from '../../middleware/authMiddleware.js';
import validate from '../../middleware/validateRequest.js';
import {
  createPaymentIntentSchema,
  paymentIdSchema,
  orderIdParamSchema,
} from '../../validations/paymentValidation.js';

/**
 * @swagger
 * /payments/config:
 *   get:
 *     summary: Get Stripe publishable key
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Configuration retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     publishableKey:
 *                       type: string
 */
router.get('/config', paymentController.getConfig);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     description: Handles Stripe webhook events for payment status updates
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Protected routes
router.use(protect);

/**
 * @swagger
 * /payments/create-intent:
 *   post:
 *     summary: Create payment intent for order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 description: Order ID to create payment for
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                       properties:
 *                         paymentIntentId:
 *                           type: string
 *                         clientSecret:
 *                           type: string
 *                         amount:
 *                           type: number
 *                         currency:
 *                           type: string
 *                         paymentId:
 *                           type: string
 *       404:
 *         description: Order not found
 */
router.post(
  '/create-intent',
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent
);

/**
 * @swagger
 * /payments/order/{orderId}:
 *   get:
 *     summary: Get payment by order ID
 *     tags: [Payments]
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
  paymentController.getPaymentByOrderId
);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
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
router.get('/:id', validate(paymentIdSchema), paymentController.getPaymentById);

export default router;
