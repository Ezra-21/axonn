/**
 * Product helper utilities
 * Pure functions for deriving display values from a Product.
 */

import { Product, ProductImage } from '../types';

/**
 * Returns the primary product image, falling back to the first image,
 * or null when the product has no images.
 */
export function getPrimaryImage(product: Pick<Product, 'images'>): ProductImage | null {
  const images = product.images ?? [];
  if (images.length === 0) return null;
  return images.find((img) => img.isPrimary) ?? images[0];
}

/**
 * Whether the product currently has stock available.
 */
export function isInStock(product: Pick<Product, 'stock'>): boolean {
  return (product.stock ?? 0) > 0;
}

/**
 * Whether the product is at or below its low-stock threshold (but still in stock).
 */
export function isLowStock(product: Pick<Product, 'stock' | 'lowStockThreshold'>): boolean {
  const stock = product.stock ?? 0;
  const threshold = product.lowStockThreshold ?? 0;
  return stock > 0 && stock <= threshold;
}

/**
 * Discount percentage derived from comparePrice vs price.
 * Returns 0 when there is no valid discount.
 */
export function getDiscountPercentage(
  product: Pick<Product, 'price' | 'comparePrice'>
): number {
  const price = Number(product.price);
  const compare = Number(product.comparePrice);

  if (!Number.isFinite(price) || !Number.isFinite(compare)) return 0;
  if (compare <= 0 || price <= 0) return 0;
  if (compare <= price) return 0;

  return Math.round(((compare - price) / compare) * 100);
}

/**
 * Whether a product is on sale (has a higher comparePrice than its price).
 */
export function isOnSale(product: Pick<Product, 'price' | 'comparePrice'>): boolean {
  return getDiscountPercentage(product) > 0;
}
