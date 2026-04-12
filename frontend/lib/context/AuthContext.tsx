/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../api';
import { ApiError } from '../api/client';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = storage.getAccessToken();
        const storedUser = storage.getUser();

        if (token && storedUser) {
          // Use stored user data (trust localStorage)
          // Don't verify on every page load to avoid loops
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        storage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    setUser(response.user);
    toast.success('Login successful!');
  };

  // Register function
  const register = async (data: RegisterData) => {
    const response = await authApi.register(data);
    setUser(response.user);
    toast.success('Registration successful!');
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Clear local state even if API call fails
      setUser(null);
    }
  };

  // Update user function (for profile updates)
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// persists user session across page refreshes via localStorage

// fix: clear stale user data on 401 response

// final: token expiry checked client-side before each request