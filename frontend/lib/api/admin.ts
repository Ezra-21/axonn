/**
 * Admin API Service
 * Handles admin-specific API requests for all backend endpoints
 */

import apiClient from './client';
import { ApiResponse, PaginationMeta, Product, Order, User, Category, ProductQueryParams, OrderQueryParams } from '../types';

export interface DashboardStats {
  counts: {
    users: number;
    products: number;
    orders: number;
    categories: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export const adminApi = {
  // --- Dashboard ---
  getDashboardStats: async () => {
    const response = await apiClient.get<ApiResponse<{ stats: DashboardStats }>>('/admin/dashboard');
    return response.data.data?.stats;
  },

  // --- Products ---
  getProducts: async (params?: ProductQueryParams) => {
    const response = await apiClient.get<ApiResponse<{ products: Product[] } & { pagination: PaginationMeta }>>('/admin/products', { params });
    return {
      success: response.data.success,
      data: response.data.data?.products || [],
      pagination: (response.data as any).meta?.pagination
    };
  },

  createProduct: async (data: any) => {
    const response = await apiClient.post<ApiResponse<{ product: Product }>>('/admin/products', data);
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ product: Product }>>(`/admin/products/${id}`);
    return response.data;
  },

  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<{ product: Product }>>(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/admin/products/${id}`);
    return response.data;
  },

  uploadProductImages: async (id: string, formData: FormData) => {
    const response = await apiClient.post<ApiResponse<{ product: Product }>>(`/admin/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteProductImage: async (id: string, imageId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/admin/products/${id}/images/${imageId}`);
    return response.data;
  },

  // --- Categories ---
  getCategories: async () => {
    const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/admin/products/categories/all');
    return {
      success: response.data.success,
      data: response.data.data?.categories || []
    };
  },

  createCategory: async (data: any) => {
    const response = await apiClient.post<ApiResponse<{ category: Category }>>('/admin/products/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<{ category: Category }>>(`/admin/products/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/admin/products/categories/${id}`);
    return response.data;
  },

  // --- Orders ---
  getOrders: async (params?: OrderQueryParams) => {
    const response = await apiClient.get<ApiResponse<{ orders: Order[] } & { pagination: PaginationMeta }>>('/admin/orders', { params });
    return {
      success: response.data.success,
      data: response.data.data?.orders || [],
      pagination: (response.data as any).meta?.pagination
    };
  },

  getOrder: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ order: Order }>>(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string, notes?: string) => {
    const response = await apiClient.put<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/status`, { status, notes });
    return response.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const response = await apiClient.put<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  // --- Users ---
  getUsers: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<{ users: User[] } & { pagination: PaginationMeta }>>('/admin/users', { params });
    return {
      success: response.data.success,
      data: response.data.data?.users || [],
      pagination: (response.data as any).meta?.pagination
    };
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/users/${id}`, data);
    return response.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(`/admin/users/${id}/status`);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/admin/users/${id}`);
    return response.data;
  },

  // --- Payments ---
  getPaymentByOrder: async (orderId: string) => {
    const response = await apiClient.get<ApiResponse<{ payment: any }>>(`/admin/payments/order/${orderId}`);
    return response.data;
  },

  refundPayment: async (orderId: string, data: { amount?: number; reason?: string }) => {
    const response = await apiClient.post<ApiResponse<any>>(`/admin/payments/${orderId}/refund`, data);
    return response.data;
  }
};

// admin dashboard metrics: revenue, orders, top products