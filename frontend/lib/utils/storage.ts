/**
 * Local Storage Utility
 * Securely manages tokens and user data in browser storage
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'axon_access_token',
  REFRESH_TOKEN: 'axon_refresh_token',
  USER: 'axon_user',
} as const;

// Token Management
export const storage = {
  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Set access token
  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Set refresh token
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  // Get user data
  getUser: (): any | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  // Set user data
  setUser: (user: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Save complete auth response
  saveAuthData: (data: { accessToken: string; refreshToken: string; user: any }): void => {
    storage.setAccessToken(data.accessToken);
    storage.setRefreshToken(data.refreshToken);
    storage.setUser(data.user);
  },
};

// storage wrapper with try/catch for private browsing mode