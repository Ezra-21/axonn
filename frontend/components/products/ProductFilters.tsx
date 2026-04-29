/**
 * Product Filters Component
 * Sidebar filters for products page
 */

'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  onFilterChange,
}: ProductFiltersProps) {
  const handleCategoryChange = (categorySlug: string) => {
    onFilterChange({
      category: categorySlug === selectedCategory ? undefined : categorySlug,
      minPrice,
      maxPrice,
      inStock,
    });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({
      category: selectedCategory,
      minPrice: min,
      maxPrice: max,
      inStock,
    });
  };

  const handleStockChange = () => {
    onFilterChange({
      category: selectedCategory,
      minPrice,
      maxPrice,
      inStock: !inStock,
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
        <h3 className="text-lg font-bold text-slate-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h4>
        <div className="space-y-3">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <label key={category.id} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory === category.slug}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-all"></div>
                  <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-brand-600 transition-colors">
                  {category.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No categories available</p>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) =>
                  handlePriceChange(
                    e.target.value ? parseFloat(e.target.value) : undefined,
                    maxPrice
                  )
                }
                className="w-full pl-6 pr-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/10 transition-all outline-none"
              />
            </div>
            <span className="text-slate-300">/</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) =>
                  handlePriceChange(
                    minPrice,
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full pl-6 pr-3 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500/10 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Availability</h4>
        <label className="flex items-center group cursor-pointer">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={inStock || false}
              onChange={handleStockChange}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-all"></div>
            <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-brand-600 transition-colors">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );
}

// filters update URL search params for shareable links

// price range slider with debounced API calls