/**
 * Product Detail Page
 * Individual product page with details and add to cart
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import ProductGrid from '@/components/products/ProductGrid';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsApi.getBySlug(slug);
        setProduct(productData);

        // Fetch related products only if product was found
        if (productData) {
          try {
            const related = await productsApi.getRelated(productData.id);
            setRelatedProducts(related);
          } catch (error) {
            console.error('Failed to fetch related products:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-3xl mb-6 text-slate-400">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h1>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">The item you're looking for might have been moved or is no longer available in our collection.</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 px-8"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  const images = product.images ?? [];
  const primaryImage = images[selectedImage] || images[0];

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="container mx-auto px-6 pt-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
          {product.category && (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-600 transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-600 truncate max-w-[150px]">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
              {primaryImage ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 aspect-square rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      index === selectedImage 
                        ? 'border-brand-600 shadow-lg shadow-brand-100 scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <div className="flex gap-2 mb-6">
              {product.isFeatured && (
                <span className="px-3 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  Featured Piece
                </span>
              )}
              {product.isNewArrival && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  New Arrival
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-slate-900">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-slate-400 line-through">
                  ${parseFloat(product.comparePrice.toString()).toFixed(2)}
                </span>
              )}
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  product.stock === 0 ? 'bg-red-400' : product.stock < 5 ? 'bg-orange-400' : 'bg-emerald-400'
                }`} />
                <span className="text-sm font-bold text-slate-500">
                  {product.stock === 0 ? 'Out of stock' : product.stock < 5 ? `Only ${product.stock} left` : 'In Stock'}
                </span>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg mb-10">
              {product.shortDescription || "This meticulously designed piece brings a modern touch to any interior. Crafted with premium materials for durability and style."}
            </p>

            {/* Config & Action */}
            <div className="space-y-8 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 w-fit border border-slate-100">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-600 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-600 rounded-xl transition-all"
                      disabled={product.stock <= quantity}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3 flex flex-col justify-end">
                   <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-4 text-base font-bold shadow-2xl shadow-brand-200"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material</p>
                  <p className="text-sm font-semibold text-slate-900">{product.material || 'Premium Finish'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensions</p>
                  <p className="text-sm font-semibold text-slate-900">{product.dimensions || 'Standard Size'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 px-4">
              <h3 className="text-xl font-bold text-slate-900">Product Description</h3>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line text-sm">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pt-20 border-t border-slate-100">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Recommendations</h2>
                <h3 className="text-3xl font-bold text-slate-900">You Might Also Like</h3>
              </div>
            </div>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}

// dynamic metadata generated from product name and description