/**
 * Cart API
 * Handles all cart-related API calls
 * All functions include defensive null checks to prevent runtime errors
 */

import apiClient from './client';
import { Cart, ApiResponse } from '../types';

// Default empty cart structure
const emptyCart: Cart = {
  id: '',
  userId: '',
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const cartApi = {
  // Get user's cart
  get: async (): Promise<Cart> => {
    try {
      const response = await apiClient.get<ApiResponse<Cart>>('/cart');
      const data = response.data?.data;
      // Ensure items is always an array
      return data ? { ...data, items: data.items ?? [] } : emptyCart;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return emptyCart;
    }
  },

  // Get cart item count
  getCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/cart/count');
      return response.data?.data?.count ?? 0;
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      return 0;
    }
  },

  // Add item to cart
  addItem: async (productId: string, quantity = 1): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', {
      productId,
      quantity,
    });
    const data = response.data?.data;
    return data ? { ...data, items: data.items ?? [] } : emptyCart;
  },

  // Update cart item quantity
  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
    });
    const data = response.data?.data;
    return data ? { ...data, items: data.items ?? [] } : emptyCart;
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  // Clear entire cart
  clear: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};

// cart merge: combine guest and authenticated cart on login