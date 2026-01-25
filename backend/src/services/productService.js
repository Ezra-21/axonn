/**
 * Product Service
 * Business logic for product operations
 */

import { prisma } from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { generateSlug, generateUniqueSlug, generateSKU } from '../utils/helpers.js';
import { buildPaginationMeta, parsePaginationParams, parseSortParams } from '../utils/pagination.js';

/**
 * Get all products with filters and pagination
 * @param {Object} query - Query parameters
 * @returns {Object} Products with pagination
 */
const getAllProducts = async (query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  const sortBy = parseSortParams(
    query,
    { created_at: 'created_at', price: 'price', name: 'name', stock: 'stock' },
    'created_at',
    'desc'
  );

  // Build filters
  const where = { is_active: true };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.category) {
    where.category_id = query.category;
  }

  if (query.categorySlug) {
    const category = await prisma.categories.findUnique({
      where: { slug: query.categorySlug },
    });
    if (category) {
      where.category_id = category.id;
    }
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) {
      where.price.gte = parseFloat(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      where.price.lte = parseFloat(query.maxPrice);
    }
  }

  if (query.inStock === true || query.inStock === 'true') {
    where.stock = { gt: 0 };
  }

  if (query.is_featured !== undefined) {
    where.is_featured = query.is_featured === true || query.is_featured === 'true';
  }

  if (query.is_new_arrival !== undefined) {
    where.is_new_arrival = query.is_new_arrival === true || query.is_new_arrival === 'true';
  }

  if (query.material) {
    where.material = { contains: query.material, mode: 'insensitive' };
  }

  if (query.color) {
    where.color = { contains: query.color, mode: 'insensitive' };
  }

  // Get products and total count
  const [products, totalItems] = await Promise.all([
    prisma.products.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        short_description: true,
        price: true,
        compare_price: true,
        stock: true,
        is_featured: true,
        is_new_arrival: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          where: { is_primary: true },
          take: 1,
          select: { url: true, alt_text: true },
        },
      },
      skip,
      take: limit,
      orderBy: sortBy,
    }),
    prisma.products.count({ where }),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return { products, pagination };
};

/**
 * Get product by ID
 * @param {string} product_id - Product ID
 * @returns {Object} Product
 */
const getProductById = async (product_id) => {
  const product = await prisma.products.findUnique({
    where: { id: product_id },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }],
      },
      reviews: {
        where: { is_approved: true },
        include: {
          user: {
            select: { first_name: true, last_name: true, avatar: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return product;
};

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @returns {Object} Product
 */
const getProductBySlug = async (slug) => {
  const product = await prisma.products.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        orderBy: [{ is_primary: 'desc' }, { sort_order: 'asc' }],
      },
      reviews: {
        where: { is_approved: true },
        include: {
          user: {
            select: { first_name: true, last_name: true, avatar: true },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  return product;
};

/**
 * Get featured products
 * @param {number} limit - Number of products
 * @returns {Array} Featured products
 */
const getFeaturedProducts = async (limit = 8) => {
  const products = await prisma.products.findMany({
    where: { is_active: true, is_featured: true },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compare_price: true,
      images: {
        where: { is_primary: true },
        take: 1,
        select: { url: true, alt_text: true },
      },
    },
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  return products;
};

/**
 * Get new arrivals
 * @param {number} limit - Number of products
 * @returns {Array} New arrival products
 */
const getNewArrivals = async (limit = 8) => {
  const products = await prisma.products.findMany({
    where: { is_active: true, is_new_arrival: true },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compare_price: true,
      images: {
        where: { is_primary: true },
        take: 1,
        select: { url: true, alt_text: true },
      },
    },
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  return products;
};

/**
 * Get related products
 * @param {string} product_id - Product ID
 * @param {number} limit - Number of products
 * @returns {Array} Related products
 */
const getRelatedProducts = async (product_id, limit = 4) => {
  const product = await prisma.products.findUnique({
    where: { id: product_id },
    select: { category_id: true },
  });

  if (!product) {
    return [];
  }

  const products = await prisma.products.findMany({
    where: {
      category_id: product.category_id,
      is_active: true,
      NOT: { id: product_id },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compare_price: true,
      images: {
        where: { is_primary: true },
        take: 1,
        select: { url: true, alt_text: true },
      },
    },
    take: limit,
  });

  return products;
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Create product (Admin)
 * @param {Object} productData - Product data
 * @returns {Object} Created product
 */
const createProduct = async (productData) => {
  // Generate slug
  let slug = generateSlug(productData.name);
  
  // Check if slug exists
  const existingProduct = await prisma.products.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    slug = generateUniqueSlug(productData.name);
  }

  // Generate SKU if not provided
  const category = await prisma.categories.findUnique({
    where: { id: productData.category_id },
  });

  const sku = productData.sku || generateSKU(category?.name?.substring(0, 3) || 'FUR');

  const product = await prisma.products.create({
    data: {
      ...productData,
      slug,
      sku,
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return product;
};

/**
 * Update product (Admin)
 * @param {string} product_id - Product ID
 * @param {Object} updateData - Update data
 * @returns {Object} Updated product
 */
const updateProduct = async (product_id, updateData) => {
  const existingProduct = await prisma.products.findUnique({
    where: { id: product_id },
  });

  if (!existingProduct) {
    throw ApiError.notFound('Product not found');
  }

  // Update slug if name changed
  if (updateData.name && updateData.name !== existingProduct.name) {
    let slug = generateSlug(updateData.name);
    const slugExists = await prisma.products.findFirst({
      where: { slug, NOT: { id: product_id } },
    });
    if (slugExists) {
      slug = generateUniqueSlug(updateData.name);
    }
    updateData.slug = slug;
  }

  const product = await prisma.products.update({
    where: { id: product_id },
    data: updateData,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: true,
    },
  });

  return product;
};

/**
 * Delete product (Admin)
 * @param {string} product_id - Product ID
 */
const deleteProduct = async (product_id) => {
  const product = await prisma.products.findUnique({
    where: { id: product_id },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  await prisma.products.delete({
    where: { id: product_id },
  });
};

/**
 * Add product images (Admin)
 * @param {string} product_id - Product ID
 * @param {Array} images - Image data array
 * @returns {Array} Created images
 */
const addProductImages = async (product_id, images) => {
  const product = await prisma.products.findUnique({
    where: { id: product_id },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  const createdImages = await prisma.product_images.createMany({
    data: images.map((image, index) => ({
      product_id,
      url: image.url,
      public_id: image.public_id,
      alt_text: image.alt_text || product.name,
      is_primary: index === 0 && images.length === 1,
      sort_order: index,
    })),
  });

  return createdImages;
};

/**
 * Delete product image (Admin)
 * @param {string} imageId - Image ID
 */
const deleteProductImage = async (imageId) => {
  const image = await prisma.product_images.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw ApiError.notFound('Image not found');
  }

  await prisma.product_images.delete({
    where: { id: imageId },
  });

  return image;
};

/**
 * Get all products for admin (with inactive)
 * @param {Object} query - Query parameters
 * @returns {Object} Products with pagination
 */
const adminGetAllProducts = async (query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  const sortBy = parseSortParams(
    query,
    { created_at: 'created_at', price: 'price', name: 'name', stock: 'stock' },
    'created_at',
    'desc'
  );

  // Build filters (include inactive)
  const where = {};

  if (query.is_active !== undefined) {
    where.is_active = query.is_active === true || query.is_active === 'true';
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { sku: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.category) {
    where.category_id = query.category;
  }

  // Get products and total count
  const [products, totalItems] = await Promise.all([
    prisma.products.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true },
        },
        images: {
          where: { is_primary: true },
          take: 1,
        },
        _count: {
          select: { orderItems: true, reviews: true },
        },
      },
      skip,
      take: limit,
      orderBy: sortBy,
    }),
    prisma.products.count({ where }),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return { products, pagination };
};

export {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  deleteProductImage,
  adminGetAllProducts,
};
