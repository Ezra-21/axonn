/**
 * Cart Controller
 * Handles cart-related HTTP requests
 */

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/apiResponse.js';
import * as cartService from '../../services/cartService.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  ApiResponse.success(res, 200, 'Cart retrieved successfully', { cart });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const { product_id, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, product_id, quantity);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.ITEM_ADDED_TO_CART, { cart });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:itemId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(
    req.user.id,
    req.params.itemId,
    quantity,
  );
  ApiResponse.success(res, 200, 'Cart item updated successfully', { cart });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.params.itemId);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.ITEM_REMOVED_FROM_CART, { cart });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  ApiResponse.success(res, 200, SUCCESS_MESSAGES.CART_CLEARED, { cart });
});

/**
 * @desc    Get cart item count
 * @route   GET /api/cart/count
 * @access  Private
 */
const getCartItemCount = asyncHandler(async (req, res) => {
  const count = await cartService.getCartItemCount(req.user.id);
  ApiResponse.success(res, 200, 'Cart count retrieved', { count });
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount,
};
