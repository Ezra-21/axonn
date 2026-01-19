/**
 * Product Validation Schemas
 * Joi schemas for product-related requests
 */

import Joi from 'joi';

// Create product validation (Admin)
const createProductSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(200).required().messages({
      'string.min': 'Product name must be at least 3 characters',
      'string.max': 'Product name cannot exceed 200 characters',
      'any.required': 'Product name is required',
    }),
    description: Joi.string().min(10).max(5000).required().messages({
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description cannot exceed 5000 characters',
      'any.required': 'Description is required',
    }),
    shortDescription: Joi.string().max(500).optional().messages({
      'string.max': 'Short description cannot exceed 500 characters',
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),
    comparePrice: Joi.number().positive().precision(2).optional().messages({
      'number.positive': 'Compare price must be a positive number',
    }),
    costPrice: Joi.number().positive().precision(2).optional().messages({
      'number.positive': 'Cost price must be a positive number',
    }),
    sku: Joi.string().max(50).optional().messages({
      'string.max': 'SKU cannot exceed 50 characters',
    }),
    barcode: Joi.string().max(50).optional(),
    stock: Joi.number().integer().min(0).default(0).messages({
      'number.min': 'Stock cannot be negative',
    }),
    lowStockThreshold: Joi.number().integer().min(0).default(5),
    weight: Joi.number().positive().optional(),
    dimensions: Joi.string().max(50).optional(),
    material: Joi.string().max(100).optional(),
    color: Joi.string().max(50).optional(),
    categoryId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid category ID',
      'any.required': 'Category is required',
    }),
    isActive: Joi.boolean().default(true),
    isFeatured: Joi.boolean().default(false),
    isNewArrival: Joi.boolean().default(false),
  }),
};

// Update product validation (Admin)
const updateProductSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid product ID',
      'any.required': 'Product ID is required',
    }),
  }),
  body: Joi.object({
    name: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(5000).optional(),
    shortDescription: Joi.string().max(500).optional(),
    price: Joi.number().positive().precision(2).optional(),
    comparePrice: Joi.number().positive().precision(2).allow(null).optional(),
    costPrice: Joi.number().positive().precision(2).allow(null).optional(),
    sku: Joi.string().max(50).optional(),
    barcode: Joi.string().max(50).allow(null).optional(),
    stock: Joi.number().integer().min(0).optional(),
    lowStockThreshold: Joi.number().integer().min(0).optional(),
    weight: Joi.number().positive().allow(null).optional(),
    dimensions: Joi.string().max(50).allow(null).optional(),
    material: Joi.string().max(100).allow(null).optional(),
    color: Joi.string().max(50).allow(null).optional(),
    categoryId: Joi.string().uuid().optional(),
    isActive: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
  }),
};

// Product query validation
const productQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).optional(),
    category: Joi.string().uuid().optional(),
    categorySlug: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    isNewArrival: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
    material: Joi.string().optional(),
    color: Joi.string().optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'price', 'name', 'stock')
      .default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

// Product ID parameter validation
const productIdSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid product ID',
      'any.required': 'Product ID is required',
    }),
  }),
};

// Product slug parameter validation
const productSlugSchema = {
  params: Joi.object({
    slug: Joi.string().required().messages({
      'any.required': 'Product slug is required',
    }),
  }),
};

// Create category validation
const createCategorySchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Category name must be at least 2 characters',
      'string.max': 'Category name cannot exceed 100 characters',
      'any.required': 'Category name is required',
    }),
    description: Joi.string().max(500).optional(),
    parentId: Joi.string().uuid().allow(null).optional(),
    isActive: Joi.boolean().default(true),
  }),
};

// Update category validation
const updateCategorySchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid category ID',
      'any.required': 'Category ID is required',
    }),
  }),
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    parentId: Joi.string().uuid().allow(null).optional(),
    isActive: Joi.boolean().optional(),
  }),
};

// Product review validation
const createReviewSchema = {
  params: Joi.object({
    productId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid product ID',
      'any.required': 'Product ID is required',
    }),
  }),
  body: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5',
      'any.required': 'Rating is required',
    }),
    title: Joi.string().max(100).optional(),
    comment: Joi.string().max(1000).optional(),
  }),
};

export {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productIdSchema,
  productSlugSchema,
  createCategorySchema,
  updateCategorySchema,
  createReviewSchema,
};
