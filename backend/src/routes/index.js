/**
 * Main Routes Index
 * Combine all API routes
 */

import express from 'express';
const router = express.Router();

import userRoutes from './user/index.js';
import adminRoutes from './admin/index.js';

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Axon API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount user routes
router.use('/', userRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

export default router;
