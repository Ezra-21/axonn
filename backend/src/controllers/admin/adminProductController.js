/**
 * Admin Product Controller
 * Handles product management HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as productService from '../../services/productService.js';
import { prisma } from '../../config/database.js';
import { generateSlug, generateUniqueSlug } from '../../utils/helpers.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * @desc    Get all products (including inactive)
 * @route   GET /api/admin/products
 * @access  Private (Admin)
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.adminGetAllProducts(req.query);
  ApiResponse.paginated(res, { products }, pagination, 'Products retrieved');
});

/**
 * @desc    Get product by ID
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin)
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  ApiResponse.success(res, 200, 'Product retrieved', { product });
});

/**
 * @desc    Create new product
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  ApiResponse.created(res, SUCCESS_MESSAGES.PRODUCT_CREATED, { product });
});

/**
 * @desc    Update product
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.PRODUCT_UPDATED, { product });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.PRODUCT_DELETED);
});

/**
 * @desc    Upload product images
 * @route   POST /api/admin/products/:id/images
 * @access  Private (Admin)
 */
const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return ApiResponse.badRequest(res, 'No images provided');
  }

  const images = req.files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));

  await productService.addProductImages(req.params.id, images);

  const product = await productService.getProductById(req.params.id);
  ApiResponse.success(res, 200, 'Images uploaded successfully', { product });
});

/**
 * @desc    Delete product image
 * @route   DELETE /api/admin/products/:id/images/:imageId
 * @access  Private (Admin)
 */
const deleteProductImage = asyncHandler(async (req, res) => {
  await productService.deleteProductImage(req.params.imageId);
  ApiResponse.success(res, 200, 'Image deleted successfully');
});

/**
 * @desc    Get all categories
 * @route   GET /api/admin/categories
 * @access  Private (Admin)
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.categories.findMany({
    include: {
      parent: {
        select: { id: true, name: true },
      },
      _count: {
        select: { products: true, subcategories: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  ApiResponse.success(res, 200, 'Categories retrieved', { categories });
});

/**
 * @desc    Create category
 * @route   POST /api/admin/categories
 * @access  Private (Admin)
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parent_id, is_active } = req.body;

  let slug = generateSlug(name);
  const existingCategory = await prisma.categories.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    slug = generateUniqueSlug(name);
  }

  const category = await prisma.categories.create({
    data: {
      name,
      slug,
      description,
      parent_id,
      is_active: is_active ?? true,
    },
  });

  ApiResponse.created(res, 'Category created successfully', { category });
});

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id
 * @access  Private (Admin)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, parent_id, is_active } = req.body;

  const existingCategory = await prisma.categories.findUnique({
    where: { id: req.params.id },
  });

  if (!existingCategory) {
    return ApiResponse.notFound(res, 'Category not found');
  }

  const updateData = { description, parent_id, is_active };

  if (name && name !== existingCategory.name) {
    updateData.name = name;
    let slug = generateSlug(name);
    const slugExists = await prisma.categories.findFirst({
      where: { slug, NOT: { id: req.params.id } },
    });
    if (slugExists) {
      slug = generateUniqueSlug(name);
    }
    updateData.slug = slug;
  }

  const category = await prisma.categories.update({
    where: { id: req.params.id },
    data: updateData,
  });

  ApiResponse.success(res, 200, 'Category updated successfully', { category });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/admin/categories/:id
 * @access  Private (Admin)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await prisma.categories.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return ApiResponse.notFound(res, 'Category not found');
  }

  if (category._count.products > 0) {
    return ApiResponse.badRequest(
      res,
      'Cannot delete category with products. Move or delete products first.',
    );
  }

  await prisma.categories.delete({
    where: { id: req.params.id },
  });

  ApiResponse.success(res, 200, 'Category deleted successfully');
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
