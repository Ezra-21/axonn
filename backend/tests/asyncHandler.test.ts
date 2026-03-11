import { describe, it, expect, vi } from 'vitest';
import asyncHandler from '../src/utils/asyncHandler.js';

const makeReqRes = () => ({
  req: {},
  res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
  next: vi.fn(),
});

describe('asyncHandler', () => {
  it('calls the wrapped function with req, res, next', async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('does not call next when the function resolves', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with the error when the function rejects', async () => {
    const err = new Error('Something went wrong');
    const fn  = vi.fn().mockRejectedValue(err);
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('calls next when the function rejects with a TypeError', async () => {
    const err = new TypeError('Type mismatch error');
    const fn  = vi.fn().mockRejectedValue(err);
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('returns a function (middleware signature)', () => {
    const wrapped = asyncHandler(async () => {});
    expect(typeof wrapped).toBe('function');
    expect(wrapped.length).toBe(3);
  });

  it('forwards the resolved value from the inner function', async () => {
    const fn = vi.fn(async (_req, res) => res.json({ ok: true }));
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('handles async functions that return data', async () => {
    const data = { id: 1, name: 'Test' };
    const fn = vi.fn(async (_req, res) => {
      res.status(200).json(data);
    });
    const { req, res, next } = makeReqRes();
    await asyncHandler(fn)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
    expect(next).not.toHaveBeenCalled();
  });
});
