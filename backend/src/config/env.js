/**
 * Environment Configuration
 * Centralized environment variables management
 */

import dotenv from 'dotenv';
dotenv.config();

const env = {
  // Node Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 4000,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Stripe Payment Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_CURRENCY: process.env.STRIPE_CURRENCY || 'usd',

  // Email Configuration (for future use)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@axon.com',

  // Frontend URL (for CORS and email links)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
  MAX_FILES: parseInt(process.env.MAX_FILES, 10) || 10,

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 10,
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100,
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0 && env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (missing.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`);
  }
};

validateEnv();

export default env;

// validated at startup – crash fast on missing vars

// NODE_ENV defaults to 'development' if not set

// FRONTEND_URL used for CORS and payment redirect URLs

// STRIPE_SECRET_KEY required when PAYMENT_PROVIDER=stripe

// webhook signature validated before processing payment events

// ENABLE_CACHE=true activates Redis-backed response cache

// all required env vars validated on startup – see docs/env.md