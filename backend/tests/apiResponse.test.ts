import { describe, it, expect, vi } from 'vitest';
import ApiResponse from '../src/utils/apiResponse.js';

// ─── mock Express res object ───────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json   = vi.fn().mockReturnValue(res);
  res.send   = vi.fn().mockReturnValue(res);
  return res;
};

describe('ApiResponse.success', () => {
  it('sends the correct status code', () => {
    const res = mockRes();
    ApiResponse.success(res, 200, 'OK', { id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('includes success: true in body', () => {
    const res = mockRes();
    ApiResponse.success(res, 200, 'OK', { id: 1 });
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(true);
    expect(body.message).toBe('OK');
    expect(body.data).toEqual({ id: 1 });
  });

  it('omits meta when not provided', () => {
    const res = mockRes();
    ApiResponse.success(res, 200, 'OK', null);
    const body = res.json.mock.calls[0][0];
    expect(body.meta).toBeUndefined();
  });

  it('includes meta when provided', () => {
    const res = mockRes();
    ApiResponse.success(res, 200, 'OK', [], { total: 5 });
    const body = res.json.mock.calls[0][0];
    expect(body.meta).toEqual({ total: 5 });
  });
});

describe('ApiResponse.created', () => {
  it('sends 201', () => {
    const res = mockRes();
    ApiResponse.created(res, 'Created', { id: 42 });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('sets success: true', () => {
    const res = mockRes();
    ApiResponse.created(res, 'Done', { id: 1 });
    expect(res.json.mock.calls[0][0].success).toBe(true);
  });
});

describe('ApiResponse.noContent', () => {
  it('sends 204 with no body', () => {
    const res = mockRes();
    ApiResponse.noContent(res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});

describe('ApiResponse.error', () => {
  it('sends the correct error status code', () => {
    const res = mockRes();
    ApiResponse.error(res, 400, 'Bad request');
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('sets success: false in body', () => {
    const res = mockRes();
    ApiResponse.error(res, 400, 'Bad request');
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toBe('Bad request');
  });

  it('includes errors when provided', () => {
    const res = mockRes();
    const errors = [{ field: 'email', msg: 'required' }];
    ApiResponse.error(res, 422, 'Validation failed', errors);
    expect(res.json.mock.calls[0][0].errors).toEqual(errors);
  });

  it('omits errors key when not provided', () => {
    const res = mockRes();
    ApiResponse.error(res, 500, 'Server error');
    expect(res.json.mock.calls[0][0].errors).toBeUndefined();
  });
});

describe('ApiResponse convenience methods', () => {
  it('badRequest sends 400', () => {
    const res = mockRes();
    ApiResponse.badRequest(res, 'Bad input');
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('unauthorized sends 401', () => {
    const res = mockRes();
    ApiResponse.unauthorized(res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('forbidden sends 403', () => {
    const res = mockRes();
    ApiResponse.forbidden(res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('notFound sends 404', () => {
    const res = mockRes();
    ApiResponse.notFound(res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('conflict sends 409', () => {
    const res = mockRes();
    ApiResponse.conflict(res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('validationError sends 422', () => {
    const res = mockRes();
    ApiResponse.validationError(res, 'Invalid', []);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('tooManyRequests sends 429', () => {
    const res = mockRes();
    ApiResponse.tooManyRequests(res);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('serverError sends 500', () => {
    const res = mockRes();
    ApiResponse.serverError(res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('ApiResponse.paginated', () => {
  it('sends 200 with pagination meta', () => {
    const res = mockRes();
    const paginationMeta = { page: 1, limit: 10, total: 50 };
    ApiResponse.paginated(res, [{ id: 1 }], paginationMeta, 'Products');
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.meta.pagination).toEqual(paginationMeta);
    expect(body.data).toEqual([{ id: 1 }]);
    expect(body.message).toBe('Products');
  });

  it('sets success: true', () => {
    const res = mockRes();
    ApiResponse.paginated(res, [], {});
    expect(res.json.mock.calls[0][0].success).toBe(true);
  });
});
