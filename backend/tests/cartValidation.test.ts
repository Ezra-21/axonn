import { describe, it, expect } from 'vitest';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  bulkUpdateCartSchema,
} from '../src/validations/cartValidation.js';

const validate = (schema, data) => schema.validate(data, { abortEarly: false });
const ok   = (schema, data) => expect(validate(schema, data).error).toBeUndefined();
const fail = (schema, data) => expect(validate(schema, data).error).toBeDefined();

const UUID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

// ─── addToCartSchema ──────────────────────────────────────────────────────────
describe('addToCartSchema', () => {
  const schema = addToCartSchema.body;

  it('accepts a valid add-to-cart payload', () =>
    ok(schema, { productId: UUID, quantity: 2 }));

  it('defaults quantity to 1 when omitted', () => {
    const { value } = validate(schema, { productId: UUID });
    expect(value.quantity).toBe(1);
  });

  it('requires productId', () =>
    fail(schema, { quantity: 1 }));

  it('rejects non-UUID productId', () =>
    fail(schema, { productId: 'not-a-uuid', quantity: 1 }));

  it('rejects quantity below 1', () =>
    fail(schema, { productId: UUID, quantity: 0 }));

  it('rejects quantity above 100', () =>
    fail(schema, { productId: UUID, quantity: 101 }));

  it('rejects fractional quantity', () =>
    fail(schema, { productId: UUID, quantity: 1.5 }));
});

// ─── updateCartItemSchema ─────────────────────────────────────────────────────
describe('updateCartItemSchema', () => {
  const paramsSchema = updateCartItemSchema.params;
  const bodySchema   = updateCartItemSchema.body;

  it('accepts a valid itemId param UUID', () =>
    ok(paramsSchema, { itemId: UUID }));

  it('rejects a non-UUID itemId param', () =>
    fail(paramsSchema, { itemId: 'bad-id' }));

  it('requires itemId in params', () =>
    fail(paramsSchema, {}));

  it('accepts a valid quantity in body', () =>
    ok(bodySchema, { quantity: 5 }));

  it('requires quantity in body', () =>
    fail(bodySchema, {}));

  it('rejects quantity of 0 in body', () =>
    fail(bodySchema, { quantity: 0 }));

  it('rejects quantity above 100 in body', () =>
    fail(bodySchema, { quantity: 200 }));

  it('rejects fractional quantity in body', () =>
    fail(bodySchema, { quantity: 2.5 }));
});

// ─── removeCartItemSchema ─────────────────────────────────────────────────────
describe('removeCartItemSchema', () => {
  const schema = removeCartItemSchema.params;

  it('accepts a valid itemId', () =>
    ok(schema, { itemId: UUID }));

  it('rejects a non-UUID itemId', () =>
    fail(schema, { itemId: 'abc' }));

  it('requires itemId', () =>
    fail(schema, {}));
});

// ─── bulkUpdateCartSchema ─────────────────────────────────────────────────────
describe('bulkUpdateCartSchema', () => {
  const schema = bulkUpdateCartSchema.body;

  const validItem = { productId: UUID, quantity: 2 };

  it('accepts a valid bulk update with one item', () =>
    ok(schema, { items: [validItem] }));

  it('accepts multiple items', () =>
    ok(schema, {
      items: [
        { productId: UUID, quantity: 1 },
        { productId: '8f14e45f-ceea-467a-a866-051b735a03bb', quantity: 3 },
      ],
    }));

  it('requires items array', () =>
    fail(schema, {}));

  it('rejects empty items array', () =>
    fail(schema, { items: [] }));

  it('rejects item with non-UUID productId', () =>
    fail(schema, { items: [{ productId: 'bad', quantity: 1 }] }));

  it('rejects item with quantity below 1', () =>
    fail(schema, { items: [{ productId: UUID, quantity: 0 }] }));

  it('rejects item with quantity above 100', () =>
    fail(schema, { items: [{ productId: UUID, quantity: 999 }] }));

  it('rejects item missing quantity', () =>
    fail(schema, { items: [{ productId: UUID }] }));

  it('rejects item missing productId', () =>
    fail(schema, { items: [{ quantity: 2 }] }));
});
