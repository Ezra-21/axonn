/**
 * Cart calculation utilities
 * Pure functions for deriving cart totals so the logic is testable
 * independently of React state.
 */

import { CartItem } from '../types';

/**
 * Total number of units across all cart items.
 */
export function calculateItemCount(items: CartItem[] = []): number {
  return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

/**
 * Total monetary value of the cart.
 * Product price may arrive as a number or a string, so it is coerced safely.
 */
export function calculateTotalAmount(items: CartItem[] = []): number {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.product?.price?.toString() ?? '0');
    const safePrice = Number.isFinite(price) ? price : 0;
    return sum + safePrice * (item.quantity ?? 0);
  }, 0);
}

/**
 * Format a numeric amount as a localized currency string.
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(safeAmount);
}

/**
 * Whether the cart has no items.
 */
export function isCartEmpty(items: CartItem[] = []): boolean {
  return calculateItemCount(items) === 0;
}
