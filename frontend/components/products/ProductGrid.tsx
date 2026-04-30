/**
 * Product Grid Component
 * Displays a grid of products
 */

import React from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({ 
  products, 
  emptyMessage = 'No products found' 
}: ProductGridProps) {
  // Safe check: ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];
  
  if (safeProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// fix: show loading skeleton while fetching products