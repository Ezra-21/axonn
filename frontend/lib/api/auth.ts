/**
 * Authentication API
 * Handles all authentication-related API calls
 */

import apiClient, { ApiError } from './client';
import { AuthResponse, LoginCredentials, RegisterData, User, ApiResponse } from '../types';
import { storage } from '../utils/storage';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
      
      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        // Save auth data to storage
        storage.saveAuthData(authData);
        return authData;
      }
      
      throw new ApiError('Registration failed', 400);
    } catch (error) {
      // Re-throw ApiError as is
      if (error instanceof ApiError) {
        throw error;
      }
      // Wrap other errors
      throw new ApiError('Registration failed. Please try again.', 500);
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        // Save auth data to storage
        storage.saveAuthData(authData);
        return authData;
      }
      
      throw new ApiError('Login failed', 400);
    } catch (error) {
      // Re-throw ApiError as is
      if (error instanceof ApiError) {
        throw error;
      }
      // Wrap other errors
      throw new ApiError('Login failed. Please try again.', 500);
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear storage even if API call fails
      storage.clearAuth();
    }
  },

  // Get current user profile
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new ApiError('Failed to get user profile', 400);
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh-token',
      { refreshToken }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new ApiError('Failed to refresh token', 401);
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await apiClient.post('/auth/change-password', data);
  },
};

// tokens stored in httpOnly cookies via API route proxy

// fix: redirect to intended URL after successful login