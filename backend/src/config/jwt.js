/**
 * JWT Configuration
 * Token generation and verification utilities
 */

import jwt from 'jsonwebtoken';
import env from './env.js';

/**
 * Generate access token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: 'axon',
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: 'axon',
  });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing both tokens
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};

// access token: 15 min, refresh token: 7 days

// use RS256 in production for better key rotation support

// test: expired token returns 401, tampered token returns 403