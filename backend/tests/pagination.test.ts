import { describe, it, expect } from 'vitest';
import {
  parsePaginationParams,
  buildPaginationMeta,
  parseSortParams,
  buildSearchFilter,
  buildPriceFilter,
} from '../src/utils/pagination.js';

describe('parsePaginationParams', () => {
  it('applies defaults for an empty query', () => {
    expect(parsePaginationParams({})).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('parses page and limit and computes skip', () => {
    expect(parsePaginationParams({ page: '3', limit: '20' })).toEqual({
      page: 3,
      limit: 20,
      skip: 40,
    });
  });

  it('clamps limit to the maximum', () => {
    expect(parsePaginationParams({ limit: '500' }).limit).toBe(100);
  });

  it('clamps page to a minimum of 1', () => {
    expect(parsePaginationParams({ page: '-5' }).page).toBe(1);
  });
});

describe('buildPaginationMeta', () => {
  it('builds metadata for a middle page', () => {
    const meta = buildPaginationMeta(25, 2, 10);
    expect(meta).toEqual({
      currentPage: 2,
      itemsPerPage: 10,
      totalItems: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
      nextPage: 3,
      prevPage: 1,
    });
  });

  it('flags no next page on the last page', () => {
    const meta = buildPaginationMeta(25, 3, 10);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.nextPage).toBeNull();
  });
});

describe('parseSortParams', () => {
  it('maps an allowed sort field and order', () => {
    expect(parseSortParams({ sortBy: 'price', sortOrder: 'asc' }, { price: 'price' })).toEqual({
      price: 'asc',
    });
  });

  it('falls back to defaults for a disallowed field', () => {
    expect(parseSortParams({ sortBy: 'hacker' }, { price: 'price' })).toEqual({
      createdAt: 'desc',
    });
  });
});

describe('buildSearchFilter', () => {
  it('builds an OR filter across fields', () => {
    expect(buildSearchFilter('chair', ['name', 'description'])).toEqual({
      OR: [
        { name: { contains: 'chair', mode: 'insensitive' } },
        { description: { contains: 'chair', mode: 'insensitive' } },
      ],
    });
  });

  it('returns an empty object when the term is blank', () => {
    expect(buildSearchFilter('', ['name'])).toEqual({});
  });
});

describe('buildPriceFilter', () => {
  it('builds a gte/lte price range', () => {
    expect(buildPriceFilter(10, 100)).toEqual({ price: { gte: 10, lte: 100 } });
  });

  it('returns an empty object with no bounds', () => {
    expect(buildPriceFilter(undefined, undefined)).toEqual({});
  });
});
