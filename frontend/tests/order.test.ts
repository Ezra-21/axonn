import { describe, it, expect } from 'vitest';
import {
  getStatusLabel,
  getStatusColor,
  canCancelOrder,
  isOrderFinal,
  isPaid,
} from '../lib/utils/order';
import { OrderStatus, PaymentStatus } from '../lib/types';

describe('getStatusLabel', () => {
  it('maps each known status to a label', () => {
    expect(getStatusLabel(OrderStatus.PENDING)).toBe('Pending');
    expect(getStatusLabel(OrderStatus.DELIVERED)).toBe('Delivered');
    expect(getStatusLabel(OrderStatus.REFUNDED)).toBe('Refunded');
  });

  it('returns Unknown for an unrecognized status', () => {
    expect(getStatusLabel('WAT')).toBe('Unknown');
  });
});

describe('getStatusColor', () => {
  it('returns green for delivered orders', () => {
    expect(getStatusColor(OrderStatus.DELIVERED)).toBe('green');
  });

  it('returns red for cancelled orders', () => {
    expect(getStatusColor(OrderStatus.CANCELLED)).toBe('red');
  });

  it('returns yellow for pending orders', () => {
    expect(getStatusColor(OrderStatus.PENDING)).toBe('yellow');
  });

  it('falls back to gray for unknown statuses', () => {
    expect(getStatusColor('???')).toBe('gray');
  });
});

describe('canCancelOrder', () => {
  it('allows cancelling before shipment', () => {
    expect(canCancelOrder(OrderStatus.PENDING)).toBe(true);
    expect(canCancelOrder(OrderStatus.CONFIRMED)).toBe(true);
    expect(canCancelOrder(OrderStatus.PROCESSING)).toBe(true);
  });

  it('disallows cancelling once shipped or later', () => {
    expect(canCancelOrder(OrderStatus.SHIPPED)).toBe(false);
    expect(canCancelOrder(OrderStatus.DELIVERED)).toBe(false);
    expect(canCancelOrder(OrderStatus.CANCELLED)).toBe(false);
  });
});

describe('isOrderFinal', () => {
  it('is true for terminal states', () => {
    expect(isOrderFinal(OrderStatus.DELIVERED)).toBe(true);
    expect(isOrderFinal(OrderStatus.CANCELLED)).toBe(true);
    expect(isOrderFinal(OrderStatus.REFUNDED)).toBe(true);
  });

  it('is false for in-progress states', () => {
    expect(isOrderFinal(OrderStatus.PENDING)).toBe(false);
    expect(isOrderFinal(OrderStatus.SHIPPED)).toBe(false);
  });
});

describe('isPaid', () => {
  it('is true only for PAID', () => {
    expect(isPaid(PaymentStatus.PAID)).toBe(true);
  });

  it('is false for other payment statuses', () => {
    expect(isPaid(PaymentStatus.PENDING)).toBe(false);
    expect(isPaid(PaymentStatus.FAILED)).toBe(false);
    expect(isPaid(PaymentStatus.REFUNDED)).toBe(false);
  });
});
