/**
 * User API
 * Handles user profile and address management
 * All functions include defensive null checks to prevent runtime errors
 */

import apiClient from './client';
import { User, Address, CreateAddressData, ApiResponse } from '../types';

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/users/profile');
      return response.data?.data ?? null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    if (!response.data?.data) {
      throw new Error('Failed to update profile');
    }
    return response.data.data;
  },

  // Update user avatar
  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.put<ApiResponse<User>>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!response.data?.data) {
      throw new Error('Failed to update avatar');
    }
    return response.data.data;
  },

  // Get user addresses
  getAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Address[]>>('/users/addresses');
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      return [];
    }
  },

  // Add new address
  addAddress: async (data: CreateAddressData): Promise<Address> => {
    const response = await apiClient.post<ApiResponse<Address>>('/users/addresses', data);
    if (!response.data?.data) {
      throw new Error('Failed to add address');
    }
    return response.data.data;
  },

  // Update address
  updateAddress: async (id: string, data: Partial<CreateAddressData>): Promise<Address> => {
    const response = await apiClient.put<ApiResponse<Address>>(`/users/addresses/${id}`, data);
    if (!response.data?.data) {
      throw new Error('Failed to update address');
    }
    return response.data.data;
  },

  // Delete address
  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/addresses/${id}`);
  },
};

// update profile: PATCH /users/me supports name, avatar, address