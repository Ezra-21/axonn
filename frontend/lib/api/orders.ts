/**
 * Orders API
 * Handles all order-related API calls
 * All functions include defensive null checks to prevent runtime errors
 */

import apiClient from './client';
import { Order, CreateOrderData, ApiResponse, PaginatedResponse, OrderQueryParams } from '../types';

// Default empty paginated response for orders
const emptyPaginatedResponse: PaginatedResponse<Order> = {
  success: true,
  data: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

export const ordersApi = {
  // Create new order
  create: async (data: CreateOrderData): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
    if (!response.data?.data) {
      throw new Error('Failed to create order');
    }
    return response.data.data;
  },

  // Get user's orders
  getMyOrders: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Order>>('/orders', { params });
      return {
        success: response.data?.success ?? true,
        data: response.data?.data ?? [],
        pagination: response.data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return emptyPaginatedResponse;
    }
  },

  // Get order by ID
  getById: async (id: string): Promise<Order | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  },

  // Cancel order
  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
    if (!response.data?.data) {
      throw new Error('Failed to cancel order');
    }
    return response.data.data;
  },
};

// order polling: re-fetch every 30s while status is PENDING