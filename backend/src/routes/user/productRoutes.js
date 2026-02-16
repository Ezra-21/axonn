/**
 * Product Routes
 * Public product browsing endpoints
 */

import express from 'express';
const router = express.Router();

import * as productController from '../../controllers/user/productController.js';
import validate from '../../middleware/validateRequest.js';
import {
  productQuerySchema,
  productIdSchema,
  productSlugSchema,
} from '../../validations/productValidation.js';

// Product listing and search

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination and filters
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortQuery'
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: minPrice
 *         in: query
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         schema:
 *           type: number
 *       - name: inStock
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get('/', validate(productQuerySchema), productController.getAllProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by name or description
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/SearchQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured products retrieved
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /products/new-arrivals:
 *   get:
 *     summary: Get new arrival products
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         description: New arrivals retrieved
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/new-arrivals', productController.getNewArrivals);

// Product details

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/slug/:slug',
  validate(productSlugSchema),
  productController.getProductBySlug,
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', validate(productIdSchema), productController.getProductById);

/**
 * @swagger
 * /products/{id}/related:
 *   get:
 *     summary: Get related products
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         description: Related products retrieved
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get(
  '/:id/related',
  validate(productIdSchema),
  productController.getRelatedProducts,
);

// Categories

/**
 * @swagger
 * /products/categories/all:
 *   get:
 *     summary: Get all categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/categories/all', productController.getAllCategories);

/**
 * @swagger
 * /products/categories/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Products]
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/categories/:slug', productController.getCategoryBySlug);

export default router;
