/**
 * Admin Routes Index
 * Combine all admin routes
 */

import express from 'express';
const router = express.Router();

import adminAuthRoutes from './adminAuthRoutes.js';
import adminDashboardRoutes from './adminDashboardRoutes.js';
import adminProductRoutes from './adminProductRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';
import adminUserRoutes from './adminUserRoutes.js';
import adminPaymentRoutes from './adminPaymentRoutes.js';

// Mount routes
router.use('/auth', adminAuthRoutes);
router.use('/dashboard', adminDashboardRoutes);
router.use('/products', adminProductRoutes);
router.use('/orders', adminOrderRoutes);
router.use('/users', adminUserRoutes);
router.use('/payments', adminPaymentRoutes);

export default router;
