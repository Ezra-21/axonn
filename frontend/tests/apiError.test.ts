import { describe, it, expect } from 'vitest';
import { ApiError } from '../lib/api/client';

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const err = new ApiError('boom', 500);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('carries a message and status', () => {
    const err = new ApiError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.status).toBe(404);
  });

  it('sets the error name to ApiError', () => {
    expect(new ApiError('x', 400).name).toBe('ApiError');
  });

  it('stores field-level validation errors', () => {
    const errors = [{ field: 'email', message: 'Email is required' }];
    const err = new ApiError('Validation failed', 422, errors);
    expect(err.errors).toEqual(errors);
  });

  it('leaves errors undefined when not provided', () => {
    expect(new ApiError('x', 400).errors).toBeUndefined();
  });

  it('is throwable and catchable as ApiError', () => {
    try {
      throw new ApiError('caught', 403);
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(403);
    }
  });
});
