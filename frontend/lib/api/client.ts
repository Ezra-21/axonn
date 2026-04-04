/**
 * API Client
 * Axios instance with interceptors for auth and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;
  
  constructor(message: string, status: number, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(new ApiError('Request failed', 0));
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<{ success: boolean; message?: string; errors?: Array<{ field: string; message: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle network errors
    if (!error.response) {
      return Promise.reject(new ApiError(
        'Network error. Please check your internet connection and make sure the server is running.',
        0
      ));
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized errors (token expired)
    // Skip token refresh for auth endpoints (login, register, etc.)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/refresh-token');
    
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();
        
        if (!refreshToken) {
          storage.clearAuth();
          return Promise.reject(new ApiError('Please login to continue.', 401));
        }

        // Attempt to refresh the access token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data.success) {
          const { accessToken } = response.data.data;
          storage.setAccessToken(accessToken);

          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        storage.clearAuth();
        return Promise.reject(new ApiError('Please login to continue.', 401));
      }
    }

    // Extract error message from response
    let errorMessage = 'An error occurred';
    
    if (data?.errors && data.errors.length > 0) {
      // Prioritize specific validation error message
      errorMessage = data.errors[0].message;
    } else if (data?.message) {
      errorMessage = data.message;
    }

    // Create and return ApiError with all details
    return Promise.reject(new ApiError(errorMessage, status, data?.errors));
  }
);

export default apiClient;

// base URL read from NEXT_PUBLIC_API_URL env var

// retry once on 5xx with exponential backoff

// fix: include credentials for cross-origin cookie support