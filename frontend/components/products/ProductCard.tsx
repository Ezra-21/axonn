/**
 * Product Card Component
 * Displays a single product in a grid/list view
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Get primary image or first image
  const images = product.images ?? [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-white">
        {/* Product Image */}
        <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                Featured
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Sale Badge */}
          {product.comparePrice && parseFloat(product.comparePrice.toString()) > parseFloat(product.price.toString()) && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 bg-white text-brand-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-brand-100">
                Sale
              </span>
            </div>
          )}

          {/* Hover Overlay Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-2 text-sm shadow-xl shadow-brand-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.1em] mb-2">
              {product.category.name}
            </p>
          ) || <div className="h-4" />}

          {/* Product Name */}
          <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {product.shortDescription || "Elevate your living space with this exquisite piece of furniture."}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-slate-400 line-through mt-1">
                  ${parseFloat(product.comparePrice.toString()).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                product.stock === 0 ? 'bg-red-400' : product.stock < 5 ? 'bg-orange-400' : 'bg-emerald-400'
              }`} />
              <span className="text-[11px] font-medium text-slate-500">
                {product.stock === 0 ? 'Out of stock' : product.stock < 5 ? 'Low stock' : 'In stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// lazy-load product images with next/image priority=false

// optimistic UI: update cart count before API response