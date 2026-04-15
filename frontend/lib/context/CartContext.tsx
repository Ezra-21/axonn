/**
 * Cart Context
 * Manages shopping cart state and provides cart methods
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '../types';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';
import { calculateItemCount, calculateTotalAmount } from '../utils/cart';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  totalAmount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Calculate derived values (with safe checks for undefined items)
  const items = cart?.items ?? [];
  const itemCount = calculateItemCount(items);
  const totalAmount = calculateTotalAmount(items);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  // Refresh cart data
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const cartData = await cartApi.get();
      setCart(cartData);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      // Don't show error toast for cart fetch failures
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.addItem(productId, quantity);
      setCart(updatedCart);
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.updateItem(itemId, quantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      await cartApi.removeItem(itemId);
      // Refresh cart after removing item
      await refreshCart();
      toast.success('Removed from cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clear();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    itemCount,
    totalAmount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// cart synced to backend on every add/remove operation

// fix: prevent duplicate cart items on rapid click

// cart total calculated client-side for instant feedback