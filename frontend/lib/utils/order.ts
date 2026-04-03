/**
 * Order helper utilities
 * Pure functions for order status display and business rules.
 */

import { OrderStatus, PaymentStatus } from '../types';

/**
 * Human-readable label for an order status.
 */
export function getStatusLabel(status: OrderStatus | string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };
  return labels[status] ?? 'Unknown';
}

/**
 * Tailwind-ish color token for an order status badge.
 */
export function getStatusColor(status: OrderStatus | string): string {
  const colors: Record<string, string> = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    PROCESSING: 'blue',
    SHIPPED: 'indigo',
    DELIVERED: 'green',
    CANCELLED: 'red',
    REFUNDED: 'gray',
  };
  return colors[status] ?? 'gray';
}

/**
 * A customer can only cancel an order that has not yet shipped.
 */
export function canCancelOrder(status: OrderStatus | string): boolean {
  return status === 'PENDING' || status === 'CONFIRMED' || status === 'PROCESSING';
}

/**
 * Whether an order is in a terminal (final) state.
 */
export function isOrderFinal(status: OrderStatus | string): boolean {
  return status === 'DELIVERED' || status === 'CANCELLED' || status === 'REFUNDED';
}

/**
 * Whether the order has been paid for.
 */
export function isPaid(paymentStatus: PaymentStatus | string): boolean {
  return paymentStatus === 'PAID';
}
