import { describe, it, expect } from 'vitest';
import {
  calculateItemCount,
  calculateTotalAmount,
  formatCurrency,
  isCartEmpty,
} from '../lib/utils/cart';
import type { CartItem } from '../lib/types';

// Minimal CartItem builder for tests
const item = (price: number | string, quantity: number): CartItem =>
  ({
    id: 'item-1',
    cartId: 'cart-1',
    productId: 'prod-1',
    quantity,
    product: { price } as CartItem['product'],
    createdAt: '',
    updatedAt: '',
  }) as CartItem;

describe('calculateItemCount', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateItemCount([])).toBe(0);
  });

  it('returns 0 when no argument is passed', () => {
    expect(calculateItemCount()).toBe(0);
  });

  it('sums quantities across items', () => {
    expect(calculateItemCount([item(10, 2), item(5, 3)])).toBe(5);
  });

  it('handles a single item', () => {
    expect(calculateItemCount([item(10, 1)])).toBe(1);
  });
});

describe('calculateTotalAmount', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateTotalAmount([])).toBe(0);
  });

  it('multiplies price by quantity and sums', () => {
    expect(calculateTotalAmount([item(10, 2), item(5, 3)])).toBe(35);
  });

  it('coerces string prices to numbers', () => {
    expect(calculateTotalAmount([item('19.99', 2)])).toBeCloseTo(39.98, 2);
  });

  it('treats a non-numeric price as 0', () => {
    expect(calculateTotalAmount([item('abc', 4)])).toBe(0);
  });

  it('handles a mix of string and numeric prices', () => {
    expect(calculateTotalAmount([item('10', 1), item(20, 2)])).toBe(50);
  });
});

describe('formatCurrency', () => {
  it('formats a USD amount by default', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('falls back to 0 for a non-finite amount', () => {
    expect(formatCurrency(NaN)).toBe('$0.00');
  });

  it('supports a different currency', () => {
    const result = formatCurrency(10, 'EUR', 'en-US');
    expect(result).toContain('10');
    expect(result).toMatch(/€|EUR/);
  });
});

describe('isCartEmpty', () => {
  it('returns true for an empty array', () => {
    expect(isCartEmpty([])).toBe(true);
  });

  it('returns true with no argument', () => {
    expect(isCartEmpty()).toBe(true);
  });

  it('returns false when items exist', () => {
    expect(isCartEmpty([item(10, 1)])).toBe(false);
  });
});
