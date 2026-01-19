/**
 * Cart Service
 * Business logic for cart operations
 */

import { prisma } from '../config/database.js';
import ApiError from '../utils/apiError.js';

/**
 * Get user cart with items
 * @param {string} user_id - User ID
 * @returns {Object} Cart with items
 */
const getCart = async (user_id) => {
  let cart = await prisma.carts.findUnique({
    where: { user_id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              compare_price: true,
              stock: true,
              is_active: true,
              images: {
                where: { is_primary: true },
                take: 1,
                select: { url: true, alt_text: true },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      },
    },
  });

  // Create cart if doesn't exist
  if (!cart) {
    cart = await prisma.carts.create({
      data: { user_id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                compare_price: true,
                stock: true,
                is_active: true,
                images: {
                  where: { is_primary: true },
                  take: 1,
                  select: { url: true, alt_text: true },
                },
              },
            },
          },
        },
      },
    });
  }

  // Calculate totals
  const cartWithTotals = calculateCartTotals(cart);

  return cartWithTotals;
};

/**
 * Add item to cart
 * @param {string} user_id - User ID
 * @param {string} product_id - Product ID
 * @param {number} quantity - Quantity
 * @returns {Object} Updated cart
 */
const addToCart = async (user_id, product_id, quantity = 1) => {
  // Check if product exists and is active
  const product = await prisma.products.findUnique({
    where: { id: product_id },
    select: { id: true, name: true, stock: true, is_active: true },
  });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  if (!product.is_active) {
    throw ApiError.badRequest('Product is not available');
  }

  if (product.stock < quantity) {
    throw ApiError.badRequest(`Insufficient stock. Only ${product.stock} available`);
  }

  // Get or create cart
  let cart = await prisma.carts.findUnique({
    where: { user_id },
  });

  if (!cart) {
    cart = await prisma.carts.create({
      data: { user_id },
    });
  }

  // Check if item already in cart
  const existingItem = await prisma.cart_items.findUnique({
    where: {
      cart_id_product_id: {
        cart_id: cart.id,
        product_id,
      },
    },
  });

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw ApiError.badRequest(`Cannot add more. Only ${product.stock} available`);
    }

    await prisma.cart_items.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    // Add new item
    await prisma.cart_items.create({
      data: {
        cart_id: cart.id,
        product_id,
        quantity,
      },
    });
  }

  // Return updated cart
  return getCart(user_id);
};

/**
 * Update cart item quantity
 * @param {string} user_id - User ID
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Object} Updated cart
 */
const updateCartItem = async (user_id, itemId, quantity) => {
  // Get cart item
  const cartItem = await prisma.cart_items.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      product: {
        select: { stock: true, is_active: true },
      },
    },
  });

  if (!cartItem) {
    throw ApiError.notFound('Cart item not found');
  }

  // Verify ownership
  if (cartItem.cart.user_id !== user_id) {
    throw ApiError.forbidden('Not authorized');
  }

  // Check stock
  if (quantity > cartItem.product.stock) {
    throw ApiError.badRequest(`Insufficient stock. Only ${cartItem.product.stock} available`);
  }

  // Update quantity
  await prisma.cart_items.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getCart(user_id);
};

/**
 * Remove item from cart
 * @param {string} user_id - User ID
 * @param {string} itemId - Cart item ID
 * @returns {Object} Updated cart
 */
const removeFromCart = async (user_id, itemId) => {
  const cartItem = await prisma.cart_items.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem) {
    throw ApiError.notFound('Cart item not found');
  }

  // Verify ownership
  if (cartItem.cart.user_id !== user_id) {
    throw ApiError.forbidden('Not authorized');
  }

  await prisma.cart_items.delete({
    where: { id: itemId },
  });

  return getCart(user_id);
};

/**
 * Clear cart
 * @param {string} user_id - User ID
 * @returns {Object} Empty cart
 */
const clearCart = async (user_id) => {
  const cart = await prisma.carts.findUnique({
    where: { user_id },
  });

  if (cart) {
    await prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });
  }

  return getCart(user_id);
};

/**
 * Get cart item count
 * @param {string} user_id - User ID
 * @returns {number} Item count
 */
const getCartItemCount = async (user_id) => {
  const cart = await prisma.carts.findUnique({
    where: { user_id },
    include: {
      items: {
        select: { quantity: true },
      },
    },
  });

  if (!cart) return 0;

  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calculate cart totals
 * @param {Object} cart - Cart with items
 * @returns {Object} Cart with totals
 */
const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const itemTotal = parseFloat(item.product.price) * item.quantity;
    subtotal += itemTotal;
    totalItems += item.quantity;

    return {
      ...item,
      itemTotal,
    };
  });

  return {
    ...cart,
    items,
    subtotal,
    totalItems,
  };
};

/**
 * Validate cart items before checkout
 * @param {string} user_id - User ID
 * @returns {Object} Validation result
 */
const validateCartForCheckout = async (user_id) => {
  const cart = await getCart(user_id);
  const errors = [];

  if (cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  for (const item of cart.items) {
    if (!item.product.is_active) {
      errors.push({
        product_id: item.product.id,
        message: `${item.product.name} is no longer available`,
      });
    } else if (item.product.stock < item.quantity) {
      errors.push({
        product_id: item.product.id,
        message: `${item.product.name} has insufficient stock. Only ${item.product.stock} available`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cart,
  };
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount,
  validateCartForCheckout,
};
