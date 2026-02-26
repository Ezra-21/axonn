/**
 * Admin Product Routes
 */

import express from 'express';
const router = express.Router();

import * as adminProductController from '../../controllers/admin/adminProductController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';
import { uploadProductImages } from '../../config/cloudinary.js';
import validate from '../../middleware/validateRequest.js';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from '../../validations/productValidation.js';
import { idParamSchema } from '../../validations/userValidation.js';

// All routes require admin authentication
router.use(protect, requireAdmin);

// Product routes

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortQuery'
 *       - $ref: '#/components/parameters/SearchQuery'
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get(
  '/',
  validate(productQuerySchema),
  adminProductController.getAllProducts,
);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     summary: Create new product
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *               price:
 *                 type: number
 *                 minimum: 0
 *               comparePrice:
 *                 type: number
 *                 minimum: 0
 *               costPrice:
 *                 type: number
 *                 minimum: 0
 *               sku:
 *                 type: string
 *                 maxLength: 50
 *               barcode:
 *                 type: string
 *                 maxLength: 50
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *               lowStockThreshold:
 *                 type: integer
 *                 minimum: 0
 *                 default: 5
 *               weight:
 *                 type: number
 *                 minimum: 0
 *               dimensions:
 *                 type: string
 *                 maxLength: 50
 *               material:
 *                 type: string
 *                 maxLength: 100
 *               color:
 *                 type: string
 *                 maxLength: 50
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               isNewArrival:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/',
  validate(createProductSchema),
  adminProductController.createProduct,
);

/**
 * @swagger
 * /admin/products/{id}:
 *   get:
 *     summary: Get product by ID (Admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  validate(productIdSchema),
  adminProductController.getProductById,
);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Admin - Products]
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
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 5000
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *               price:
 *                 type: number
 *                 minimum: 0
 *               comparePrice:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *               costPrice:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *               sku:
 *                 type: string
 *                 maxLength: 50
 *               barcode:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               lowStockThreshold:
 *                 type: integer
 *                 minimum: 0
 *               weight:
 *                 type: number
 *                 minimum: 0
 *                 nullable: true
 *               dimensions:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *               material:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *               color:
 *                 type: string
 *                 maxLength: 50
 *                 nullable: true
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isNewArrival:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  validate(updateProductSchema),
  adminProductController.updateProduct,
);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id',
  validate(productIdSchema),
  adminProductController.deleteProduct,
);

// Product images

/**
 * @swagger
 * /admin/products/{id}/images:
 *   post:
 *     summary: Upload product images
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: Invalid file format or too many files
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/:id/images',
  validate(productIdSchema),
  uploadProductImages.array('images', 10),
  adminProductController.uploadProductImages,
);

/**
 * @swagger
 * /admin/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete product image
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id/images/:imageId',
  adminProductController.deleteProductImage,
);

// Category routes

/**
 * @swagger
 * /admin/products/categories/all:
 *   get:
 *     summary: Get all categories (Admin)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories/all', adminProductController.getAllCategories);

/**
 * @swagger
 * /admin/products/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Parent category ID for subcategories
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/categories',
  validate(createCategorySchema),
  adminProductController.createCategory,
);

/**
 * @swagger
 * /admin/products/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Admin - Products]
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
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 500
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/categories/:id',
  validate(updateCategorySchema),
  adminProductController.updateCategory,
);

/**
 * @swagger
 * /admin/products/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Cannot delete category with products
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/categories/:id',
  validate(idParamSchema),
  adminProductController.deleteCategory,
);

export default router;
