/**
 * Controllers Index
 * Export all controllers
 */

// User Controllers
import * as authController from './user/authController.js';
import * as userController from './user/userController.js';
import * as productController from './user/productController.js';
import * as cartController from './user/cartController.js';
import * as orderController from './user/orderController.js';
import * as paymentController from './user/paymentController.js';

// Admin Controllers
import * as adminAuthController from './admin/adminAuthController.js';
import * as adminDashboardController from './admin/adminDashboardController.js';
import * as adminProductController from './admin/adminProductController.js';
import * as adminOrderController from './admin/adminOrderController.js';
import * as adminUserController from './admin/adminUserController.js';
import * as adminPaymentController from './admin/adminPaymentController.js';

export {
  // User
  authController,
  userController,
  productController,
  cartController,
  orderController,
  paymentController,

  // Admin
  adminAuthController,
  adminDashboardController,
  adminProductController,
  adminOrderController,
  adminUserController,
  adminPaymentController,
};
