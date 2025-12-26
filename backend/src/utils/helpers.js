/**
 * Helper Utilities
 * Common helper functions used throughout the application
 */

import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
const generateSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Generate unique slug with random suffix
 * @param {string} text - Text to slugify
 * @returns {string} Unique slugified text
 */
const generateUniqueSlug = (text) => {
  const baseSlug = generateSlug(text);
  const uniqueSuffix = uuidv4().split('-')[0];
  return `${baseSlug}-${uniqueSuffix}`;
};

/**
 * Generate order number
 * Format: ORD-YYYYMMDD-XXXXX
 * @returns {string} Order number
 */
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${year}${month}${day}-${random}`;
};

/**
 * Generate SKU for products
 * Format: SKU-CATEGORY-XXXXX
 * @param {string} categoryPrefix - Category prefix (3 letters)
 * @returns {string} SKU
 */
const generateSKU = (categoryPrefix = 'GEN') => {
  const prefix = categoryPrefix.toUpperCase().substring(0, 3);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SKU-${prefix}-${random}`;
};

/**
 * Calculate percentage discount
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {number} Discount percentage
 */
const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Format price with currency
 * @param {number} price - Price value
 * @param {string} currency - Currency code
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted price
 */
const formatPrice = (price, currency = 'ETB', locale = 'en-ET') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Sanitize object - remove undefined and null values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Pick specific keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} New object with picked keys
 */
const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Omit specific keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to omit
 * @returns {Object} New object without omitted keys
 */
const omit = (obj, keys) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (!keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if string is valid UUID
 * @param {string} str - String to check
 * @returns {boolean} Is valid UUID
 */
const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Sleep utility for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after ms
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export {
  generateSlug,
  generateUniqueSlug,
  generateOrderNumber,
  generateSKU,
  calculateDiscount,
  formatPrice,
  sanitizeObject,
  pick,
  omit,
  deepClone,
  isValidUUID,
  sleep,
};

// slugify: lowercase, replace spaces with dashes, strip specials