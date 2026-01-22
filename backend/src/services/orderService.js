/**
 * Order Service
 * Business logic for order operations
 */

import { prisma } from '../config/database.js';
import ApiError from '../utils/apiError.js';
import { generateOrderNumber } from '../utils/helpers.js';
import { buildPaginationMeta, parsePaginationParams, parseSortParams } from '../utils/pagination.js';
import * as cartService from './cartService.js';

/**
 * Create order from cart
 * @param {string} user_id - User ID
 * @param {Object} orderData - Order data
 * @returns {Object} Created order
 */
const createOrder = async (user_id, orderData) => {
  // Validate cart
  const { isValid, errors, cart } = await cartService.validateCartForCheckout(user_id);

  if (!isValid) {
    throw ApiError.badRequest('Cart validation failed', errors);
  }

  // Get or build shipping address
  let shipping_addressSnapshot;

  if (orderData.address_id) {
    const address = await prisma.addresses.findFirst({
      where: { id: orderData.address_id, user_id },
    });

    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    shipping_addressSnapshot = {
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
    };
  } else if (orderData.shipping_address) {
    shipping_addressSnapshot = orderData.shipping_address;
  }

  // Calculate totals
  const subtotal = cart.subtotal;
  const tax = 0; // Can be calculated based on location
  const shipping_cost = 0; // Can be calculated based on weight/location
  const discount = 0; // Can be applied with coupon codes
  const total_amount = subtotal + tax + shipping_cost - discount;

  // Create order with transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.orders.create({
      data: {
        order_number: generateOrderNumber(),
        user_id,
        address_id: orderData.address_id,
        payment_method: orderData.payment_method || 'CASH_ON_DELIVERY',
        notes: orderData.notes,
        subtotal,
        tax,
        shipping_cost,
        discount,
        total_amount,
        shipping_address: shipping_addressSnapshot,
      },
    });

    // Create order items and update stock
    for (const cartItem of cart.items) {
      // Create order item
      await tx.order_items.create({
        data: {
          order_id: newOrder.id,
          product_id: cartItem.product.id,
          product_name: cartItem.product.name,
          product_image: cartItem.product.images[0]?.url,
          quantity: cartItem.quantity,
          unit_price: cartItem.product.price,
          total_price: cartItem.itemTotal,
        },
      });

      // Update product stock
      await tx.products.update({
        where: { id: cartItem.product.id },
        data: {
          stock: { decrement: cartItem.quantity },
        },
      });
    }

    // Create payment record for non-COD orders
    if (orderData.payment_method && orderData.payment_method !== 'CASH_ON_DELIVERY') {
      await tx.payments.create({
        data: {
          order_id: newOrder.id,
          user_id: newOrder.user_id,
          amount: total_amount,
          currency: 'usd',
          payment_method: orderData.payment_method,
          status: 'PENDING',
        },
      });
    } else {
      // For COD, create payment record but mark as pending until delivery
      await tx.payments.create({
        data: {
          order_id: newOrder.id,
          user_id: newOrder.user_id,
          amount: total_amount,
          currency: 'usd',
          payment_method: 'CASH_ON_DELIVERY',
          status: 'PENDING',
        },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cart_id: cart.id },
    });

    return newOrder;
  });

  // Fetch complete order
  return getOrderById(order.id, user_id);
};

/**
 * Get order by ID
 * @param {string} order_id - Order ID
 * @param {string} user_id - User ID (for ownership check)
 * @returns {Object} Order
 */
const getOrderById = async (order_id, user_id = null) => {
  const where = { id: order_id };

  // If user_id provided, check ownership
  if (user_id) {
    where.user_id = user_id;
  }

  const order = await prisma.orders.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              images: {
                where: { is_primary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      address: true,
      user: {
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
        },
      },
    },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  return order;
};

/**
 * Get user orders
 * @param {string} user_id - User ID
 * @param {Object} query - Query parameters
 * @returns {Object} Orders with pagination
 */
const getUserOrders = async (user_id, query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  const sortBy = parseSortParams(
    query,
    { created_at: 'created_at', total_amount: 'total_amount' },
    'created_at',
    'desc',
  );

  const where = { user_id };

  if (query.status) {
    where.status = query.status;
  }

  if (query.payment_status) {
    where.payment_status = query.payment_status;
  }

  const [orders, totalItems] = await Promise.all([
    prisma.orders.findMany({
      where,
      include: {
        items: {
          take: 3,
          select: {
            id: true,
            product_name: true,
            product_image: true,
            quantity: true,
          },
        },
        _count: { select: { items: true } },
      },
      skip,
      take: limit,
      orderBy: sortBy,
    }),
    prisma.orders.count({ where }),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return { orders, pagination };
};

/**
 * Cancel order
 * @param {string} order_id - Order ID
 * @param {string} user_id - User ID
 * @returns {Object} Cancelled order
 */
const cancelOrder = async (order_id, user_id) => {
  const order = await prisma.orders.findFirst({
    where: { id: order_id, user_id },
    include: { items: true },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Only pending orders can be cancelled by users
  if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
    throw ApiError.badRequest('Order cannot be cancelled at this stage');
  }

  // Cancel order and restore stock
  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.orders.update({
      where: { id: order_id },
      data: { status: 'CANCELLED' },
    });

    // Restore stock
    for (const item of order.items) {
      await tx.products.update({
        where: { id: item.product_id },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }
  });

  return getOrderById(order_id, user_id);
};

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Get all orders (Admin)
 * @param {Object} query - Query parameters
 * @returns {Object} Orders with pagination
 */
const getAllOrders = async (query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  const sortBy = parseSortParams(
    query,
    { created_at: 'created_at', total_amount: 'total_amount', order_number: 'order_number' },
    'created_at',
    'desc',
  );

  const where = {};

  if (query.search) {
    where.OR = [
      { order_number: { contains: query.search, mode: 'insensitive' } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  if (query.user_id) {
    where.user_id = query.user_id;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.payment_status) {
    where.payment_status = query.payment_status;
  }

  if (query.startDate || query.endDate) {
    where.created_at = {};
    if (query.startDate) {
      where.created_at.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.created_at.lte = new Date(query.endDate);
    }
  }

  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    where.total_amount = {};
    if (query.minAmount !== undefined) {
      where.total_amount.gte = parseFloat(query.minAmount);
    }
    if (query.maxAmount !== undefined) {
      where.total_amount.lte = parseFloat(query.maxAmount);
    }
  }

  const [orders, totalItems] = await Promise.all([
    prisma.orders.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        _count: { select: { items: true } },
      },
      skip,
      take: limit,
      orderBy: sortBy,
    }),
    prisma.orders.count({ where }),
  ]);

  const pagination = buildPaginationMeta(totalItems, page, limit);

  return { orders, pagination };
};

/**
 * Update order status (Admin)
 * @param {string} order_id - Order ID
 * @param {string} status - New status
 * @param {string} notes - Admin notes
 * @returns {Object} Updated order
 */
const updateOrderStatus = async (order_id, status, notes) => {
  const order = await prisma.orders.findUnique({
    where: { id: order_id },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Validate status transitions
  const validTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: ['REFUNDED'],
    CANCELLED: [],
    REFUNDED: [],
  };

  if (!validTransitions[order.status].includes(status)) {
    throw ApiError.badRequest(
      `Cannot change status from ${order.status} to ${status}`,
    );
  }

  // If cancelling, restore stock
  if (status === 'CANCELLED') {
    const orderWithItems = await prisma.orders.findUnique({
      where: { id: order_id },
      include: { items: true },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of orderWithItems.items) {
        await tx.products.update({
          where: { id: item.product_id },
          data: { stock: { increment: item.quantity } },
        });
      }

      await tx.orders.update({
        where: { id: order_id },
        data: { status, notes: notes ? `${order.notes || ''}\n${notes}` : order.notes },
      });
    });
  } else {
    await prisma.orders.update({
      where: { id: order_id },
      data: { status, notes: notes ? `${order.notes || ''}\n${notes}` : order.notes },
    });
  }

  return getOrderById(order_id);
};

/**
 * Update payment status (Admin)
 * @param {string} order_id - Order ID
 * @param {string} payment_status - New payment status
 * @returns {Object} Updated order
 */
const updatePaymentStatus = async (order_id, payment_status) => {
  const order = await prisma.orders.findUnique({
    where: { id: order_id },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  await prisma.orders.update({
    where: { id: order_id },
    data: { payment_status },
  });

  return getOrderById(order_id);
};

export {
  createOrder,
  getOrderById,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};
