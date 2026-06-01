import { describe, it, expect } from 'vitest';
import {
  getPrimaryImage,
  isInStock,
  isLowStock,
  getDiscountPercentage,
  isOnSale,
} from '../lib/utils/product';
import type { Product, ProductImage } from '../lib/types';

const image = (id: string, isPrimary: boolean): ProductImage =>
  ({
    id,
    productId: 'p1',
    url: `https://cdn/${id}.jpg`,
    isPrimary,
    sortOrder: 0,
    createdAt: '',
  }) as ProductImage;

describe('getPrimaryImage', () => {
  it('returns null when there are no images', () => {
    expect(getPrimaryImage({ images: [] })).toBeNull();
  });

  it('returns the image flagged as primary', () => {
    const primary = image('b', true);
    const result = getPrimaryImage({ images: [image('a', false), primary] });
    expect(result?.id).toBe('b');
  });

  it('falls back to the first image when none is primary', () => {
    const result = getPrimaryImage({ images: [image('a', false), image('b', false)] });
    expect(result?.id).toBe('a');
  });
});

describe('isInStock', () => {
  it('returns true when stock is positive', () => {
    expect(isInStock({ stock: 5 })).toBe(true);
  });

  it('returns false when stock is zero', () => {
    expect(isInStock({ stock: 0 })).toBe(false);
  });

  it('treats missing stock as out of stock', () => {
    expect(isInStock({} as Pick<Product, 'stock'>)).toBe(false);
  });
});

describe('isLowStock', () => {
  it('is true when stock is at or below threshold', () => {
    expect(isLowStock({ stock: 3, lowStockThreshold: 5 })).toBe(true);
    expect(isLowStock({ stock: 5, lowStockThreshold: 5 })).toBe(true);
  });

  it('is false when stock is above threshold', () => {
    expect(isLowStock({ stock: 10, lowStockThreshold: 5 })).toBe(false);
  });

  it('is false when out of stock entirely', () => {
    expect(isLowStock({ stock: 0, lowStockThreshold: 5 })).toBe(false);
  });
});

describe('getDiscountPercentage', () => {
  it('computes a rounded percentage discount', () => {
    expect(getDiscountPercentage({ price: 75, comparePrice: 100 })).toBe(25);
  });

  it('rounds to the nearest whole percent', () => {
    expect(getDiscountPercentage({ price: 66, comparePrice: 100 })).toBe(34);
  });

  it('returns 0 when comparePrice is missing', () => {
    expect(getDiscountPercentage({ price: 50 } as Product)).toBe(0);
  });

  it('returns 0 when comparePrice is not greater than price', () => {
    expect(getDiscountPercentage({ price: 100, comparePrice: 100 })).toBe(0);
    expect(getDiscountPercentage({ price: 120, comparePrice: 100 })).toBe(0);
  });

  it('returns 0 for non-positive prices', () => {
    expect(getDiscountPercentage({ price: 0, comparePrice: 100 })).toBe(0);
  });
});

describe('isOnSale', () => {
  it('is true when a discount exists', () => {
    expect(isOnSale({ price: 80, comparePrice: 100 })).toBe(true);
  });

  it('is false without a discount', () => {
    expect(isOnSale({ price: 100, comparePrice: 100 })).toBe(false);
  });
});
