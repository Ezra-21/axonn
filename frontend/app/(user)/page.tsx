/**
 * Home Page
 * Landing page with featured products and categories
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi, ApiError } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [featured, arrivals, cats] = await Promise.all([
          productsApi.getFeatured().catch(() => []),
          productsApi.getNewArrivals().catch(() => []),
          productsApi.getCategories().catch(() => []),
        ]);
        
        setFeaturedProducts(featured || []);
        setNewArrivals(arrivals || []);
        setCategories(cats || []);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load data. Please make sure the backend server is running.');
        }
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-slate-50 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 rounded-l-[100px] transform translate-x-20 -skew-x-6"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                </span>
                New Collection 2026
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
                Design Your <span className="text-brand-600">Dream</span> Space.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                Experience the perfect blend of modern aesthetics and unparalleled comfort. 
                Our curated furniture collection brings sophistication to every corner of your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 text-base shadow-xl shadow-brand-200">
                  Explore Collection
                </Link>
                <Link href="/products?category=living-room" className="bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 text-base">
                  View Catalog
                </Link>
              </div>
              
              <div className="mt-16 flex items-center gap-8 grayscale opacity-50">
                <div className="font-bold text-2xl tracking-tighter text-slate-400">NOTION</div>
                <div className="font-bold text-2xl tracking-tighter text-slate-400">VERCEL</div>
                <div className="font-bold text-2xl tracking-tighter text-slate-400">STRIPE</div>
              </div>
            </div>
            
            <div className="relative hidden lg:block animate-in fade-in slide-in-from-right duration-1000">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Interior" 
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              {/* Floating Element */}
              <div className="absolute -bottom-10 -left-10 bg-white/70 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl max-w-[240px] z-20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Quality Assured</p>
                    <p className="text-sm font-bold text-slate-900">Premium Wood</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Each piece is handcrafted with precision and care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="container mx-auto px-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-red-900">API Connection Issue</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Collections</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Shop by Category</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(categories ?? []).slice(0, 3).map((category, idx) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 bg-slate-200">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {category.description || "Discover our exclusive " + category.name.toLowerCase() + " items."}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-white text-sm font-bold">
                    Explore Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-6 py-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Highlights</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Products</h3>
            </div>
            <Link
              href="/products?isFeatured=true"
              className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* Trust Badges */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-subtle flex items-center justify-center mb-6 text-brand-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Lifetime Warranty</h4>
              <p className="text-slate-500 leading-relaxed">We stand behind our craftsmanship. Each piece comes with a lifetime protection guarantee.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-subtle flex items-center justify-center mb-6 text-brand-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Flexible Payments</h4>
              <p className="text-slate-500 leading-relaxed">Spread the cost with easy, interest-free installments designed to fit your lifestyle budget.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-subtle flex items-center justify-center mb-6 text-brand-600">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 11m8 4v10l8-4m0-10l-8-4m0 10l8 4m-8-10l-8-4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">White Glove Delivery</h4>
              <p className="text-slate-500 leading-relaxed">Our experts handle everything from delivery to setup, ensuring your furniture arrives in perfect condition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Freshly Picked</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900">New Arrivals</h3>
            </div>
            <Link
              href="/products?isNewArrival=true"
              className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
            >
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </section>
      )}

      {/* Newsletter */}
      <section className="container mx-auto px-6">
        <div className="bg-slate-900 rounded-[40px] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Stay in the loop.</h2>
            <p className="text-slate-400 text-lg mb-10">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              />
              <button className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10">Subscribe</button>
            </form>
            <p className="text-xs text-slate-500 mt-6">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
