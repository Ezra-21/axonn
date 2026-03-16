import { describe, it, expect } from 'vitest';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  orderIdSchema,
  orderQuerySchema,
  adminOrderQuerySchema,
} from '../src/validations/orderValidation.js';

const validate = (schema, data) => schema.validate(data, { abortEarly: false });
const ok   = (schema, data) => expect(validate(schema, data).error).toBeUndefined();
const fail = (schema, data) => expect(validate(schema, data).error).toBeDefined();

const UUID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

const validShippingAddress = {
  street: '123 Main Street',
  city: 'Addis Ababa',
  state: 'Addis Ababa',
  postalCode: '1000',
  country: 'Ethiopia',
};

// ─── createOrderSchema ────────────────────────────────────────────────────────
describe('createOrderSchema', () => {
  const schema = createOrderSchema.body;

  it('accepts order with addressId only', () =>
    ok(schema, { addressId: UUID }));

  it('accepts order with shippingAddress only', () =>
    ok(schema, { shippingAddress: validShippingAddress }));

  it('rejects order with neither addressId nor shippingAddress', () =>
    fail(schema, {}));

  it('accepts all payment methods', () => {
    for (const method of ['STRIPE', 'CASH_ON_DELIVERY', 'BANK_TRANSFER', 'MOBILE_PAYMENT']) {
      ok(schema, { addressId: UUID, paymentMethod: method });
    }
  });

  it('rejects an unknown payment method', () =>
    fail(schema, { addressId: UUID, paymentMethod: 'BITCOIN' }));

  it('defaults paymentMethod to CASH_ON_DELIVERY', () => {
    const { value } = validate(schema, { addressId: UUID });
    expect(value.paymentMethod).toBe('CASH_ON_DELIVERY');
  });

  it('rejects invalid addressId UUID', () =>
    fail(schema, { addressId: 'not-uuid' }));

  it('accepts optional notes', () =>
    ok(schema, { addressId: UUID, notes: 'Leave at door' }));

  it('rejects notes longer than 500 characters', () =>
    fail(schema, { addressId: UUID, notes: 'A'.repeat(501) }));

  it('rejects shippingAddress missing required street', () =>
    fail(schema, { shippingAddress: { ...validShippingAddress, street: undefined } }));

  it('rejects shippingAddress with street shorter than 5 chars', () =>
    fail(schema, { shippingAddress: { ...validShippingAddress, street: '123' } }));

  it('defaults country to Ethiopia when not provided', () => {
    const { value } = validate(schema, {
      shippingAddress: { ...validShippingAddress, country: undefined },
    });
    expect(value.shippingAddress?.country).toBe('Ethiopia');
  });
});

// ─── updateOrderStatusSchema ──────────────────────────────────────────────────
describe('updateOrderStatusSchema', () => {
  const paramsSchema = updateOrderStatusSchema.params;
  const bodySchema   = updateOrderStatusSchema.body;

  it('requires valid UUID in params', () =>
    ok(paramsSchema, { id: UUID }));

  it('rejects invalid id in params', () =>
    fail(paramsSchema, { id: 'bad' }));

  it('accepts all valid order statuses', () => {
    for (const s of ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']) {
      ok(bodySchema, { status: s });
    }
  });

  it('rejects an unknown order status', () =>
    fail(bodySchema, { status: 'LOST' }));

  it('requires status field', () =>
    fail(bodySchema, {}));

  it('accepts optional notes with status', () =>
    ok(bodySchema, { status: 'SHIPPED', notes: 'Shipped via DHL' }));
});

// ─── updatePaymentStatusSchema ────────────────────────────────────────────────
describe('updatePaymentStatusSchema', () => {
  const paramsSchema = updatePaymentStatusSchema.params;
  const bodySchema   = updatePaymentStatusSchema.body;

  it('requires valid UUID in params', () =>
    ok(paramsSchema, { id: UUID }));

  it('accepts all valid payment statuses', () => {
    for (const s of ['PENDING', 'PAID', 'FAILED', 'REFUNDED']) {
      ok(bodySchema, { paymentStatus: s });
    }
  });

  it('rejects an unknown payment status', () =>
    fail(bodySchema, { paymentStatus: 'DISPUTED' }));

  it('requires paymentStatus', () =>
    fail(bodySchema, {}));
});

// ─── orderIdSchema ────────────────────────────────────────────────────────────
describe('orderIdSchema', () => {
  const schema = orderIdSchema.params;

  it('accepts valid UUID', () => ok(schema, { id: UUID }));
  it('rejects missing id', () => fail(schema, {}));
  it('rejects non-UUID id', () => fail(schema, { id: 'abc123' }));
});

// ─── orderQuerySchema ─────────────────────────────────────────────────────────
describe('orderQuerySchema', () => {
  const schema = orderQuerySchema.query;

  it('accepts empty query with defaults', () => ok(schema, {}));

  it('defaults page to 1', () => {
    const { value } = validate(schema, {});
    expect(value.page).toBe(1);
  });

  it('defaults sortOrder to desc', () => {
    const { value } = validate(schema, {});
    expect(value.sortOrder).toBe('desc');
  });

  it('accepts valid status filter', () =>
    ok(schema, { status: 'DELIVERED' }));

  it('rejects invalid status filter', () =>
    fail(schema, { status: 'UNKNOWN' }));

  it('accepts valid paymentStatus filter', () =>
    ok(schema, { paymentStatus: 'PAID' }));

  it('rejects invalid paymentStatus filter', () =>
    fail(schema, { paymentStatus: 'CHARGEBACK' }));

  it('accepts valid sortBy values', () => {
    for (const s of ['createdAt', 'totalAmount', 'status']) {
      ok(schema, { sortBy: s });
    }
  });

  it('rejects invalid sortBy value', () =>
    fail(schema, { sortBy: 'hack' }));
});

// ─── adminOrderQuerySchema ────────────────────────────────────────────────────
describe('adminOrderQuerySchema', () => {
  const schema = adminOrderQuerySchema.query;

  it('accepts empty query', () => ok(schema, {}));

  it('accepts search string', () =>
    ok(schema, { search: 'order-001' }));

  it('accepts userId as UUID filter', () =>
    ok(schema, { userId: UUID }));

  it('rejects non-UUID userId', () =>
    fail(schema, { userId: 'bad' }));

  it('accepts minAmount and maxAmount', () =>
    ok(schema, { minAmount: 50, maxAmount: 500 }));

  it('rejects negative minAmount', () =>
    fail(schema, { minAmount: -1 }));

  it('accepts extra sortBy option orderNumber', () =>
    ok(schema, { sortBy: 'orderNumber' }));
});
