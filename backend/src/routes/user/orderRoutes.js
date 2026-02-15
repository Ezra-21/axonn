/**
 * Order Routes
 * User order management endpoints
 */

import express from 'express';
const router = express.Router();

import * as orderController from '../../controllers/user/orderController.js';
import { protect } from '../../middleware/authMiddleware.js';
import validate from '../../middleware/validateRequest.js';
import {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
} from '../../validations/orderValidation.js';

// All routes require authentication
router.use(protect);

// Order routes

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of saved address (either addressId or shippingAddress is required)
 *               shippingAddress:
 *                 type: object
 *                 description: New shipping address (either addressId or shippingAddress is required)
 *                 properties:
 *                   street:
 *                     type: string
 *                     minLength: 5
 *                     maxLength: 200
 *                   city:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                   state:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                   postalCode:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 20
 *                   country:
 *                     type: string
 *                     default: 'Ethiopia'
 *               paymentMethod:
 *                 type: string
 *                 enum: [STRIPE, CASH_ON_DELIVERY, BANK_TRANSFER, MOBILE_PAYMENT]
 *                 default: CASH_ON_DELIVERY
 *                 description: Payment method for the order. Use STRIPE for online card payments.
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty or validation error
 *       404:
 *         description: Address not found
 */
router.post('/', validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
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
 */
router.get('/', validate(orderQuerySchema), orderController.getMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
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
router.get('/:id', validate(orderIdSchema), orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id/cancel', validate(orderIdSchema), orderController.cancelOrder);

export default router;
