/**
 * Server Entry Point
 * Starts the Express server and connects to the database
 */

import app from './app.js';
import env from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import logger from './utils/logger.js';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(error.name, error.message);
  logger.error(error.stack);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Axon Backend...');
    console.log(`📍 Port: ${env.PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Start listening
    const server = app.listen(env.PORT, () => {
      logger.info(`
        ╔═══════════════════════════════════════════════════════════╗
        ║                                                           ║
        ║   🪑  AXON BACKEND API                          ║
        ║                                                           ║
        ║   Server is running on port ${env.PORT}                        ║
        ║   Environment: ${env.NODE_ENV}                           ║
        ║   URL: http://localhost:${env.PORT}                            ║
        ║   API: http://localhost:${env.PORT}/api                        ║
        ║   Health: http://localhost:${env.PORT}/api/health              ║
        ║   Docs: http://localhost:${env.PORT}/api/docs                  ║
        ║                                                           ║
        ╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle server listen errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${env.PORT} is already in use. Please free the port or change PORT in .env file`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(error.name, error.message);
      logger.error(error.stack);

      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDB();
        logger.info('Database connection closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// graceful shutdown on SIGTERM for container environments