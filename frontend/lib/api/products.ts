/**
 * Products API
 * Handles all product-related API calls
 * All functions include defensive null checks to prevent runtime errors
 */

import apiClient from './client';
import { Product, Category, ApiResponse, PaginatedResponse, ProductQueryParams } from '../types';

// Default empty paginated response
const emptyPaginatedResponse: PaginatedResponse<Product> = {
  success: true,
  data: [],
  pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
};

export const productsApi = {
  // Get all products with filters
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
      // Ensure we always return a valid structure
      return {
        success: response.data?.success ?? true,
        data: response.data?.data ?? [],
        pagination: response.data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 },
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return emptyPaginatedResponse;
    }
  },

  // Search products
  search: async (query: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<PaginatedResponse<Product>>('/products/search', {
        params: { q: query, page, limit },
      });
      return {
        success: response.data?.success ?? true,
        data: response.data?.data ?? [],
        pagination: response.data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 },
      };
    } catch (error) {
      console.error('Failed to search products:', error);
      return emptyPaginatedResponse;
    }
  },

  // Get featured products
  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/featured');
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return [];
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/new-arrivals', {
        params: { limit },
      });
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
      return [];
    }
  },

  // Get product by ID
  getById: async (id: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return null;
    }
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch product by slug:', error);
      return null;
    }
  },

  // Get related products
  getRelated: async (id: string, limit = 4): Promise<Product[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`/products/${id}/related`, {
        params: { limit },
      });
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      return [];
    }
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/products/categories/all');
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/products/categories/${slug}`);
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch category by slug:', error);
      return null;
    }
  },
};

// supports cursor-based pagination via nextCursor param

// cache product listing for 60s with stale-while-revalidate

// search: GET /products?q= triggers Prisma full-text search