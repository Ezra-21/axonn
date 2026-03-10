import { describe, it, expect } from 'vitest';
import ApiError from '../src/utils/apiError.js';

describe('ApiError', () => {
  it('is an Error subclass carrying a status code', () => {
    const err = new ApiError(400, 'bad input');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('bad input');
  });

  it('marks 4xx as "fail" and 5xx as "error"', () => {
    expect(new ApiError(404, 'x').status).toBe('fail');
    expect(new ApiError(500, 'x').status).toBe('error');
  });

  it('exposes a notFound factory', () => {
    const err = ApiError.notFound();
    expect(err.statusCode).toBe(404);
    expect(err.status).toBe('fail');
    expect(err.isOperational).toBe(true);
  });

  it('marks internal errors as non-operational', () => {
    const err = ApiError.internal();
    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
    expect(err.isOperational).toBe(false);
  });

  it('carries validation error details', () => {
    const details = [{ field: 'email', message: 'required' }];
    const err = ApiError.validation('Validation failed', details);
    expect(err.statusCode).toBe(422);
    expect(err.errors).toEqual(details);
  });
});
