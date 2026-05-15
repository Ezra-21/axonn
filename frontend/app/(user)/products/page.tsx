/**
 * Products List Page
 * Browse and filter products
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api';
import { Product, Category, ProductQueryParams } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Get filters from URL
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const inStock = searchParams.get('inStock') === 'true' || undefined;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const params: ProductQueryParams = {
          page,
          limit: 12,
          categorySlug,
          minPrice,
          maxPrice,
          inStock,
        };

        let response;
        if (search) {
          response = await productsApi.search(search, page, 12);
        } else {
          response = await productsApi.getAll(params);
        }

        setProducts(response.data ?? []);
        setPagination(response.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 0 });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, search, minPrice, maxPrice, inStock, page]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await productsApi.getCategories();
        setCategories(cats ?? []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStock) params.set('inStock', 'true');
    if (search) params.set('search', search);
    
    router.push(`/products?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-slate-600">Products</span>
              </nav>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                {search ? `Search results for "${search}"` : categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' ')}` : 'All Products'}
              </h1>
              <p className="text-slate-500 font-medium">
                Showing {products.length} of {pagination.total} unique pieces
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-slate-500 mr-2">Sort by:</div>
              <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-28">
              <ProductFilters
                categories={categories}
                selectedCategory={categorySlug}
                minPrice={minPrice}
                maxPrice={maxPrice}
                inStock={inStock}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-slate-100 rounded-3xl animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-slate-100 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-20 bg-slate-100 rounded-lg animate-pulse"></div>
                      <div className="h-4 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid 
                  products={products} 
                  emptyMessage={search ? `No products found matching "${search}"` : 'No products found'} 
                />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-16">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-white hover:shadow-subtle transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${
                          pageNum === pagination.page
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                            : 'text-slate-500 hover:bg-white hover:shadow-subtle'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-white hover:shadow-subtle transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// canonical URL set per product for SEO