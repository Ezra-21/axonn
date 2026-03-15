import { describe, it, expect } from 'vitest';
import {
  ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  SORT_OPTIONS,
  PRODUCT_STATUS,
  PAGINATION,
} from '../src/utils/constants.js';

describe('ROLES', () => {
  it('defines USER role', () => expect(ROLES.USER).toBe('USER'));
  it('defines ADMIN role', () => expect(ROLES.ADMIN).toBe('ADMIN'));
  it('defines SUPER_ADMIN role', () => expect(ROLES.SUPER_ADMIN).toBe('SUPER_ADMIN'));
  it('has exactly 3 roles', () => expect(Object.keys(ROLES)).toHaveLength(3));
});

describe('ORDER_STATUS', () => {
  it('defines all 7 expected statuses', () => {
    const expected = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED'];
    for (const s of expected) expect(ORDER_STATUS[s]).toBe(s);
  });

  it('has exactly 7 statuses', () =>
    expect(Object.keys(ORDER_STATUS)).toHaveLength(7));

  it('status values match their keys', () => {
    for (const [key, val] of Object.entries(ORDER_STATUS)) {
      expect(val).toBe(key);
    }
  });
});

describe('PAYMENT_STATUS', () => {
  it('defines PENDING status', () => expect(PAYMENT_STATUS.PENDING).toBe('PENDING'));
  it('defines PAID status',    () => expect(PAYMENT_STATUS.PAID).toBe('PAID'));
  it('defines FAILED status',  () => expect(PAYMENT_STATUS.FAILED).toBe('FAILED'));
  it('defines REFUNDED status',() => expect(PAYMENT_STATUS.REFUNDED).toBe('REFUNDED'));
  it('has exactly 4 statuses', () => expect(Object.keys(PAYMENT_STATUS)).toHaveLength(4));
});

describe('PAYMENT_METHODS', () => {
  it('defines CASH_ON_DELIVERY', () =>
    expect(PAYMENT_METHODS.CASH_ON_DELIVERY).toBe('CASH_ON_DELIVERY'));

  it('defines BANK_TRANSFER', () =>
    expect(PAYMENT_METHODS.BANK_TRANSFER).toBe('BANK_TRANSFER'));

  it('defines MOBILE_PAYMENT', () =>
    expect(PAYMENT_METHODS.MOBILE_PAYMENT).toBe('MOBILE_PAYMENT'));

  it('defines CARD', () =>
    expect(PAYMENT_METHODS.CARD).toBe('CARD'));
});

describe('SORT_OPTIONS', () => {
  it('defines NEWEST', ()  => expect(SORT_OPTIONS.NEWEST).toBe('newest'));
  it('defines OLDEST', ()  => expect(SORT_OPTIONS.OLDEST).toBe('oldest'));
  it('defines PRICE_LOW_HIGH', () => expect(SORT_OPTIONS.PRICE_LOW_HIGH).toBe('price_asc'));
  it('defines PRICE_HIGH_LOW', () => expect(SORT_OPTIONS.PRICE_HIGH_LOW).toBe('price_desc'));
  it('defines NAME_A_Z', () => expect(SORT_OPTIONS.NAME_A_Z).toBe('name_asc'));
  it('defines NAME_Z_A', () => expect(SORT_OPTIONS.NAME_Z_A).toBe('name_desc'));
});

describe('PRODUCT_STATUS', () => {
  it('ACTIVE is true',   () => expect(PRODUCT_STATUS.ACTIVE).toBe(true));
  it('INACTIVE is false',() => expect(PRODUCT_STATUS.INACTIVE).toBe(false));
});

describe('PAGINATION', () => {
  it('defines DEFAULT_PAGE', () =>
    expect(PAGINATION.DEFAULT_PAGE).toBeDefined());

  it('DEFAULT_PAGE is at least 1', () =>
    expect(PAGINATION.DEFAULT_PAGE).toBeGreaterThanOrEqual(1));
});
