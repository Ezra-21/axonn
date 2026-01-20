/**
 * Dashboard Service
 * Business logic for admin dashboard statistics
 */

import { prisma } from '../config/database.js';

/**
 * Get dashboard statistics
 * @returns {Object} Dashboard statistics
 */
const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    monthlyOrders,
    monthlyRevenue,
    lastMonthOrders,
    lastMonthRevenue,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // Total users
    prisma.users.count({ where: { role: 'USER' } }),
    
    // Total products
    prisma.products.count({ where: { is_active: true } }),
    
    // Total orders
    prisma.orders.count(),
    
    // Total revenue
    prisma.orders.aggregate({
      where: { payment_status: 'PAID' },
      _sum: { total_amount: true },
    }),
    
    // Monthly orders
    prisma.orders.count({
      where: { created_at: { gte: startOfMonth } },
    }),
    
    // Monthly revenue
    prisma.orders.aggregate({
      where: {
        created_at: { gte: startOfMonth },
        payment_status: 'PAID',
      },
      _sum: { total_amount: true },
    }),
    
    // Last month orders
    prisma.orders.count({
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
    
    // Last month revenue
    prisma.orders.aggregate({
      where: {
        created_at: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
        payment_status: 'PAID',
      },
      _sum: { total_amount: true },
    }),
    
    // Pending orders
    prisma.orders.count({ where: { status: 'PENDING' } }),
    
    // Low stock products
    prisma.products.count({
      where: {
        is_active: true,
        stock: { lte: prisma.products.fields.low_stock_threshold },
      },
    }),
    
    // Recent orders
    prisma.orders.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { first_name: true, last_name: true, email: true },
        },
      },
    }),
    
    // Top selling products
    prisma.order_items.groupBy({
      by: ['product_id'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ]);

  // Get top product details
  const topProductIds = topProducts.map((p) => p.product_id);
  const topProductDetails = await prisma.products.findMany({
    where: { id: { in: topProductIds } },
    select: {
      id: true,
      name: true,
      price: true,
      images: {
        where: { is_primary: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  // Calculate growth percentages
  const orderGrowth = lastMonthOrders > 0
    ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
    : 100;

  const revenueGrowth =
    lastMonthRevenue._sum.total_amount > 0
      ? ((parseFloat(monthlyRevenue._sum.total_amount || 0) -
          parseFloat(lastMonthRevenue._sum.total_amount || 0)) /
          parseFloat(lastMonthRevenue._sum.total_amount)) *
        100
      : 100;

  return {
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue._sum.total_amount || 0),
    },
    monthly: {
      orders: monthlyOrders,
      revenue: parseFloat(monthlyRevenue._sum.total_amount || 0),
      orderGrowth: Math.round(orderGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    },
    alerts: {
      pendingOrders,
      lowStockProducts,
    },
    recentOrders,
    topProducts: topProducts.map((p) => {
      const details = topProductDetails.find((d) => d.id === p.product_id);
      return {
        ...details,
        totalSold: p._sum.quantity,
      };
    }),
  };
};

/**
 * Get sales statistics by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Sales statistics
 */
const getSalesStats = async (startDate, endDate) => {
  const orders = await prisma.orders.findMany({
    where: {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
      payment_status: 'PAID',
    },
    select: {
      created_at: true,
      total_amount: true,
    },
  });

  // Group by date
  const salesByDate = orders.reduce((acc, order) => {
    const date = order.created_at.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, orders: 0, revenue: 0 };
    }
    acc[date].orders += 1;
    acc[date].revenue += parseFloat(order.total_amount);
    return acc;
  }, {});

  return Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get order statistics by status
 * @returns {Object} Order statistics
 */
const getOrderStats = async () => {
  const stats = await prisma.orders.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return stats.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});
};

/**
 * Get category statistics
 * @returns {Array} Category statistics
 */
const getCategoryStats = async () => {
  const categories = await prisma.categories.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      _count: {
        select: { products: true },
      },
    },
  });

  // Get sales by category
  const categorySales = await prisma.order_items.groupBy({
    by: ['product_id'],
    _sum: { quantity: true, total_price: true },
  });

  const productCategories = await prisma.products.findMany({
    select: { id: true, category_id: true },
  });

  const categoryMap = productCategories.reduce((acc, p) => {
    acc[p.id] = p.category_id;
    return acc;
  }, {});

  const salesByCat = categorySales.reduce((acc, sale) => {
    const catId = categoryMap[sale.product_id];
    if (catId) {
      if (!acc[catId]) {
        acc[catId] = { quantity: 0, revenue: 0 };
      }
      acc[catId].quantity += sale._sum.quantity || 0;
      acc[catId].revenue += parseFloat(sale._sum.total_price || 0);
    }
    return acc;
  }, {});

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    productCount: cat._count.products,
    totalSold: salesByCat[cat.id]?.quantity || 0,
    revenue: salesByCat[cat.id]?.revenue || 0,
  }));
};

export {
  getDashboardStats,
  getSalesStats,
  getOrderStats,
  getCategoryStats,
};
