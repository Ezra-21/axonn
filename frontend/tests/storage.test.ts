import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../lib/utils/storage';

beforeEach(() => {
  localStorage.clear();
});

describe('storage.accessToken', () => {
  it('returns null when no token is set', () => {
    expect(storage.getAccessToken()).toBeNull();
  });

  it('stores and retrieves the access token', () => {
    storage.setAccessToken('abc123');
    expect(storage.getAccessToken()).toBe('abc123');
  });

  it('overwrites a previously set token', () => {
    storage.setAccessToken('first');
    storage.setAccessToken('second');
    expect(storage.getAccessToken()).toBe('second');
  });
});

describe('storage.refreshToken', () => {
  it('returns null when no refresh token is set', () => {
    expect(storage.getRefreshToken()).toBeNull();
  });

  it('stores and retrieves the refresh token', () => {
    storage.setRefreshToken('refresh-xyz');
    expect(storage.getRefreshToken()).toBe('refresh-xyz');
  });
});

describe('storage.user', () => {
  it('returns null when no user is stored', () => {
    expect(storage.getUser()).toBeNull();
  });

  it('stores and retrieves a user object', () => {
    const user = { id: '1', email: 'a@b.com' };
    storage.setUser(user);
    expect(storage.getUser()).toEqual(user);
  });

  it('round-trips nested user data', () => {
    const user = { id: '1', profile: { name: 'Ezra', roles: ['ADMIN'] } };
    storage.setUser(user);
    expect(storage.getUser()).toEqual(user);
  });
});

describe('storage.saveAuthData', () => {
  it('persists token pair and user together', () => {
    const user = { id: '42', email: 'user@example.com' };
    storage.saveAuthData({ accessToken: 'at', refreshToken: 'rt', user });

    expect(storage.getAccessToken()).toBe('at');
    expect(storage.getRefreshToken()).toBe('rt');
    expect(storage.getUser()).toEqual(user);
  });
});

describe('storage.clearAuth', () => {
  it('removes all auth data', () => {
    storage.saveAuthData({
      accessToken: 'at',
      refreshToken: 'rt',
      user: { id: '1' },
    });

    storage.clearAuth();

    expect(storage.getAccessToken()).toBeNull();
    expect(storage.getRefreshToken()).toBeNull();
    expect(storage.getUser()).toBeNull();
  });

  it('is safe to call when nothing is stored', () => {
    expect(() => storage.clearAuth()).not.toThrow();
    expect(storage.getAccessToken()).toBeNull();
  });
});
