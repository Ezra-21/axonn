/**
 * User Routes
 * User profile and address management endpoints
 */

import express from 'express';
const router = express.Router();

import * as userController from '../../controllers/user/userController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { uploadUserAvatar } from '../../middleware/uploadMiddleware.js';
import validate from '../../middleware/validateRequest.js';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  idParamSchema,
} from '../../validations/userValidation.js';

// All routes require authentication
router.use(protect);

// Profile routes

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 */
router.get('/profile', userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: User's last name
 *               phone:
 *                 type: string
 *                 pattern: '^\+?[1-9]\d{1,14}$'
 *                 description: User's phone number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  '/profile',
  validate(updateProfileSchema),
  userController.updateProfile,
);

/**
 * @swagger
 * /users/avatar:
 *   put:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid file format
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/avatar', uploadUserAvatar, userController.updateAvatar);

// Address routes

/**
 * @swagger
 * /users/addresses:
 *   get:
 *     summary: Get all user addresses
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
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
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/addresses', userController.getAddresses);

/**
 * @swagger
 * /users/addresses:
 *   post:
 *     summary: Add new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - postalCode
 *             properties:
 *               street:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: Street address
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               postalCode:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 default: 'Ethiopia'
 *               isDefault:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/addresses',
  validate(createAddressSchema),
  userController.addAddress,
);

/**
 * @swagger
 * /users/addresses/{id}:
 *   put:
 *     summary: Update address
 *     tags: [Users]
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
 *             properties:
 *               street:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               postalCode:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/addresses/:id',
  validate(updateAddressSchema),
  userController.updateAddress,
);

/**
 * @swagger
 * /users/addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/addresses/:id',
  validate(idParamSchema),
  userController.deleteAddress,
);

export default router;
