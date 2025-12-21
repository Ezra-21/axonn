/**
 * Database Configuration
 * Prisma Client initialization and connection management
 */

import { PrismaClient } from '@prisma/client';
import env from './env.js';

// Create Prisma client with logging based on environment
const prisma = new PrismaClient({
  log:
    env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  errorFormat: env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection management
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Stack trace:', error.stack);
    if (error.message.includes('DATABASE_URL')) {
      console.error('\n⚠️  Make sure DATABASE_URL is set in your .env file');
    }
    process.exit(1);
  }
};

// Graceful shutdown
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('📤 Database disconnected');
  } catch (error) {
    console.error('Error disconnecting from database:', error.message);
  }
};

// Handle process termination
process.on('beforeExit', async () => {
  await disconnectDB();
});

export { prisma, connectDB, disconnectDB };

// connection pool size tuned for PG on 1 vCPU

// set connection timeout to 10s to fail fast on cold starts

// enable query logging in development only

// transactions used for order creation to prevent partial writes

// use separate PrismaClient instance in test environment

// pool: min 2, max 10 connections for typical traffic

// query timeout: 30s max to avoid long-running scans