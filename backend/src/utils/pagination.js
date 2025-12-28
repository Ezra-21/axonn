/**
 * Pagination Utility
 * Handles pagination logic for database queries
 */

import { PAGINATION } from './constants.js';

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @returns {Object} Pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build pagination metadata
 * @param {number} totalItems - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const buildPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Build Prisma pagination query options
 * @param {Object} query - Request query object
 * @returns {Object} Prisma query options
 */
const buildPrismaQuery = (query) => {
  const { page, limit, skip } = parsePaginationParams(query);
  
  return {
    skip,
    take: limit,
    pagination: { page, limit },
  };
};

/**
 * Parse sort parameters from request query
 * @param {Object} query - Request query object
 * @param {Object} allowedFields - Map of allowed sort fields
 * @param {string} defaultSort - Default sort field
 * @param {string} defaultOrder - Default sort order
 * @returns {Object} Prisma orderBy object
 */
const parseSortParams = (
  query,
  allowedFields = {},
  defaultSort = 'createdAt',
  defaultOrder = 'desc'
) => {
  const sortField = query.sortBy && allowedFields[query.sortBy]
    ? allowedFields[query.sortBy]
    : defaultSort;
  
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : defaultOrder;
  
  return { [sortField]: sortOrder };
};

/**
 * Build search filter for text fields
 * @param {string} searchTerm - Search term
 * @param {string[]} fields - Fields to search in
 * @returns {Object} Prisma where condition
 */
const buildSearchFilter = (searchTerm, fields) => {
  if (!searchTerm || !fields.length) return {};
  
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
};

/**
 * Build price range filter
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Object} Prisma where condition
 */
const buildPriceFilter = (minPrice, maxPrice) => {
  const filter = {};
  
  if (minPrice !== undefined && !isNaN(minPrice)) {
    filter.gte = parseFloat(minPrice);
  }
  
  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    filter.lte = parseFloat(maxPrice);
  }
  
  return Object.keys(filter).length > 0 ? { price: filter } : {};
};

export {
  parsePaginationParams,
  buildPaginationMeta,
  buildPrismaQuery,
  parseSortParams,
  buildSearchFilter,
  buildPriceFilter,
};
