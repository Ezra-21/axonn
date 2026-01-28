/**
 * Product Controller (User)
 * Handles product browsing HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as productService from '../../services/productService.js';
import { prisma } from '../../config/database.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAllProducts(req.query);
  ApiResponse.paginated(res, { products }, pagination, 'Products retrieved successfully');
});

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  ApiResponse.success(res, 200, 'Product retrieved successfully', { product });
});

/**
 * @desc    Get product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  ApiResponse.success(res, 200, 'Product retrieved successfully', { product });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await productService.getFeaturedProducts(limit);
  ApiResponse.success(res, 200, 'Featured products retrieved successfully', { products });
});

/**
 * @desc    Get new arrival products
 * @route   GET /api/products/new-arrivals
 * @access  Public
 */
const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  const products = await productService.getNewArrivals(limit);
  ApiResponse.success(res, 200, 'New arrivals retrieved successfully', { products });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
const getRelatedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 4;
  const products = await productService.getRelatedProducts(req.params.id, limit);
  ApiResponse.success(res, 200, 'Related products retrieved successfully', { products });
});

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.categories.findMany({
    where: { is_active: true, parent_id: null },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      subcategories: {
        where: { is_active: true },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  ApiResponse.success(res, 200, 'Categories retrieved successfully', { categories });
});

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await prisma.categories.findUnique({
    where: { slug: req.params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      subcategories: {
        where: { is_active: true },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!category) {
    return ApiResponse.notFound(res, 'Category not found');
  }

  ApiResponse.success(res, 200, 'Category retrieved successfully', { category });
});

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = asyncHandler(async (req, res) => {
  const { q, ...query } = req.query;

  if (!q || q.trim().length < 2) {
    return ApiResponse.badRequest(res, 'Search query must be at least 2 characters');
  }

  const { products, pagination } = await productService.getAllProducts({
    ...query,
    search: q.trim(),
  });

  ApiResponse.paginated(res, { products }, pagination, 'Search results retrieved');
});

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  getAllCategories,
  getCategoryBySlug,
  searchProducts,
};
