import { describe, it, expect } from 'vitest';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productIdSchema,
  productSlugSchema,
  createCategorySchema,
  updateCategorySchema,
  createReviewSchema,
} from '../src/validations/productValidation.js';

const validate = (schema, data) => schema.validate(data, { abortEarly: false });
const ok   = (schema, data) => expect(validate(schema, data).error).toBeUndefined();
const fail = (schema, data) => expect(validate(schema, data).error).toBeDefined();

const UUID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

// ─── createProductSchema ──────────────────────────────────────────────────────
describe('createProductSchema', () => {
  const schema = createProductSchema.body;

  const valid = {
    name: 'Wooden Sofa',
    description: 'A beautiful handcrafted wooden sofa.',
    price: 299.99,
    categoryId: UUID,
  };

  it('accepts a minimal valid product', () => ok(schema, valid));

  it('accepts a fully populated product', () =>
    ok(schema, {
      ...valid,
      shortDescription: 'Great sofa',
      comparePrice: 349.99,
      costPrice: 150.00,
      sku: 'SKU-001',
      barcode: '1234567890',
      stock: 10,
      lowStockThreshold: 2,
      weight: 30.5,
      dimensions: '200x90x80cm',
      material: 'Teak Wood',
      color: 'Brown',
      isActive: true,
      isFeatured: false,
      isNewArrival: true,
    }));

  it('requires name', () =>
    fail(schema, { ...valid, name: undefined }));

  it('rejects name shorter than 3 characters', () =>
    fail(schema, { ...valid, name: 'AB' }));

  it('rejects name longer than 200 characters', () =>
    fail(schema, { ...valid, name: 'A'.repeat(201) }));

  it('requires description', () =>
    fail(schema, { ...valid, description: undefined }));

  it('rejects description shorter than 10 characters', () =>
    fail(schema, { ...valid, description: 'Too short' }));

  it('requires price', () =>
    fail(schema, { ...valid, price: undefined }));

  it('rejects zero price', () =>
    fail(schema, { ...valid, price: 0 }));

  it('rejects negative price', () =>
    fail(schema, { ...valid, price: -10 }));

  it('requires categoryId', () =>
    fail(schema, { ...valid, categoryId: undefined }));

  it('rejects an invalid categoryId UUID', () =>
    fail(schema, { ...valid, categoryId: 'not-a-uuid' }));

  it('rejects negative stock', () =>
    fail(schema, { ...valid, stock: -1 }));

  it('defaults stock to 0', () => {
    const { value } = validate(schema, valid);
    expect(value.stock).toBe(0);
  });

  it('defaults isActive to true', () => {
    const { value } = validate(schema, valid);
    expect(value.isActive).toBe(true);
  });
});

// ─── updateProductSchema ──────────────────────────────────────────────────────
describe('updateProductSchema', () => {
  const paramsSchema = updateProductSchema.params;
  const bodySchema   = updateProductSchema.body;

  it('requires a valid UUID param', () =>
    ok(paramsSchema, { id: UUID }));

  it('rejects a non-UUID id param', () =>
    fail(paramsSchema, { id: 'bad-id' }));

  it('accepts an empty update body (all optional)', () =>
    ok(bodySchema, {}));

  it('rejects name shorter than 3 chars in update', () =>
    fail(bodySchema, { name: 'AB' }));

  it('rejects negative price in update', () =>
    fail(bodySchema, { price: -5 }));

  it('accepts null comparePrice to clear it', () =>
    ok(bodySchema, { comparePrice: null }));
});

// ─── productQuerySchema ───────────────────────────────────────────────────────
describe('productQuerySchema', () => {
  const schema = productQuerySchema.query;

  it('accepts an empty query (uses defaults)', () => ok(schema, {}));

  it('defaults page to 1', () => {
    const { value } = validate(schema, {});
    expect(value.page).toBe(1);
  });

  it('defaults limit to 10', () => {
    const { value } = validate(schema, {});
    expect(value.limit).toBe(10);
  });

  it('clamps limit at 100', () =>
    fail(schema, { limit: 101 }));

  it('accepts valid sortBy values', () => {
    for (const s of ['createdAt', 'price', 'name', 'stock']) {
      ok(schema, { sortBy: s });
    }
  });

  it('rejects an unknown sortBy value', () =>
    fail(schema, { sortBy: 'unknown' }));

  it('accepts sortOrder asc and desc', () => {
    ok(schema, { sortOrder: 'asc' });
    ok(schema, { sortOrder: 'desc' });
  });

  it('rejects invalid sortOrder', () =>
    fail(schema, { sortOrder: 'random' }));

  it('accepts category as UUID filter', () =>
    ok(schema, { category: UUID }));

  it('rejects category that is not a UUID', () =>
    fail(schema, { category: 'not-uuid' }));

  it('accepts minPrice and maxPrice as numbers', () =>
    ok(schema, { minPrice: 10, maxPrice: 500 }));
});

// ─── productIdSchema ──────────────────────────────────────────────────────────
describe('productIdSchema', () => {
  const schema = productIdSchema.params;

  it('accepts a valid UUID', () => ok(schema, { id: UUID }));
  it('rejects missing id', () => fail(schema, {}));
  it('rejects a non-UUID id', () => fail(schema, { id: 'abc' }));
});

// ─── productSlugSchema ────────────────────────────────────────────────────────
describe('productSlugSchema', () => {
  const schema = productSlugSchema.params;

  it('accepts a slug string', () => ok(schema, { slug: 'wooden-sofa' }));
  it('rejects a missing slug', () => fail(schema, {}));
});

// ─── createCategorySchema ─────────────────────────────────────────────────────
describe('createCategorySchema', () => {
  const schema = createCategorySchema.body;

  it('accepts a valid category', () => ok(schema, { name: 'Sofas' }));

  it('rejects name shorter than 2 characters', () =>
    fail(schema, { name: 'A' }));

  it('rejects name longer than 100 characters', () =>
    fail(schema, { name: 'A'.repeat(101) }));

  it('accepts optional description', () =>
    ok(schema, { name: 'Sofas', description: 'Comfortable seating' }));

  it('accepts optional parentId as UUID', () =>
    ok(schema, { name: 'Sub-category', parentId: UUID }));

  it('accepts null parentId for root category', () =>
    ok(schema, { name: 'Root', parentId: null }));

  it('rejects parentId that is not a UUID', () =>
    fail(schema, { name: 'Bad', parentId: 'not-uuid' }));
});

// ─── updateCategorySchema ─────────────────────────────────────────────────────
describe('updateCategorySchema', () => {
  const paramsSchema = updateCategorySchema.params;
  const bodySchema   = updateCategorySchema.body;

  it('requires a valid UUID in params', () =>
    ok(paramsSchema, { id: UUID }));

  it('rejects an invalid UUID in params', () =>
    fail(paramsSchema, { id: 'bad' }));

  it('accepts an empty body (all fields optional)', () =>
    ok(bodySchema, {}));

  it('validates name length on update', () =>
    fail(bodySchema, { name: 'A' }));
});

// ─── createReviewSchema ───────────────────────────────────────────────────────
describe('createReviewSchema', () => {
  const paramsSchema = createReviewSchema.params;
  const bodySchema   = createReviewSchema.body;

  it('requires a valid productId UUID in params', () =>
    ok(paramsSchema, { productId: UUID }));

  it('rejects invalid productId', () =>
    fail(paramsSchema, { productId: 'bad' }));

  it('accepts a minimal review with just rating', () =>
    ok(bodySchema, { rating: 4 }));

  it('accepts a full review', () =>
    ok(bodySchema, { rating: 5, title: 'Great!', comment: 'Loved it.' }));

  it('rejects rating below 1', () =>
    fail(bodySchema, { rating: 0 }));

  it('rejects rating above 5', () =>
    fail(bodySchema, { rating: 6 }));

  it('requires rating', () =>
    fail(bodySchema, {}));

  it('rejects comment longer than 1000 characters', () =>
    fail(bodySchema, { rating: 3, comment: 'A'.repeat(1001) }));
});
