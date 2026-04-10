/**
 * Payments API
 * Handles payment-related API calls
 */

import apiClient from './client';
import { Payment, PaymentIntent, ApiResponse } from '../types';

export const paymentsApi = {
  // Get Stripe configuration
  getConfig: async (): Promise<{ publishableKey: string }> => {
    const response = await apiClient.get<ApiResponse<{ publishableKey: string }>>(
      '/payments/config'
    );
    return response.data.data!;
  },

  // Create payment intent for order
  createIntent: async (orderId: string): Promise<PaymentIntent> => {
    const response = await apiClient.post<ApiResponse<{ payment: PaymentIntent }>>(
      '/payments/create-intent',
      { orderId }
    );
    return response.data.data!.payment;
  },

  // Get payment by order ID
  getByOrderId: async (orderId: string): Promise<Payment> => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/order/${orderId}`);
    return response.data.data!;
  },

  // Get payment by ID
  getById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
    return response.data.data!;
  },
};

// createPaymentIntent called before Stripe.js confirmPayment