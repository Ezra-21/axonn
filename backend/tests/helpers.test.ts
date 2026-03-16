import { describe, it, expect } from 'vitest';
import {
  generateSlug,
  generateOrderNumber,
  generateSKU,
  calculateDiscount,
  sanitizeObject,
  pick,
  omit,
  isValidUUID,
} from '../src/utils/helpers.js';

describe('generateSlug', () => {
  it('lowercases and hyphenates words', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('strips special characters', () => {
    expect(generateSlug('Modern Sofa!! (2024)')).toBe('modern-sofa-2024');
  });
});

describe('generateOrderNumber', () => {
  it('matches the ORD-YYYYMMDD-XXXXX format', () => {
    expect(generateOrderNumber()).toMatch(/^ORD-\d{8}-[A-Z0-9]{5}$/);
  });
});

describe('generateSKU', () => {
  it('uses the first three letters of the category prefix', () => {
    expect(generateSKU('furniture')).toMatch(/^SKU-FUR-[A-Z0-9]{5}$/);
  });

  it('falls back to GEN when no prefix is provided', () => {
    expect(generateSKU()).toMatch(/^SKU-GEN-[A-Z0-9]{5}$/);
  });
});

describe('calculateDiscount', () => {
  it('computes a rounded percentage discount', () => {
    expect(calculateDiscount(100, 75)).toBe(25);
  });

  it('returns 0 when sale price is not lower than original', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
    expect(calculateDiscount(100, 120)).toBe(0);
  });

  it('returns 0 for missing values', () => {
    expect(calculateDiscount(0, 50)).toBe(0);
    expect(calculateDiscount(50, 0)).toBe(0);
  });
});

describe('sanitizeObject', () => {
  it('removes null, undefined and empty-string values', () => {
    const input = { a: 1, b: null, c: undefined, d: '', e: 'keep' };
    expect(sanitizeObject(input)).toEqual({ a: 1, e: 'keep' });
  });
});

describe('pick / omit', () => {
  it('picks only the requested keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('omits the requested keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('isValidUUID', () => {
  it('accepts a valid v4 UUID', () => {
    expect(isValidUUID('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')).toBe(true);
  });

  it('rejects a non-UUID string', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
  });
});
