/**
 * Cart Item Component
 * Displays a single item in the shopping cart
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, loading } = useCart();
  const { product, quantity } = item;

  // Get primary image
  const images = product.images ?? [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];

  const itemTotal = parseFloat(product.price.toString()) * quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    await updateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    if (confirm('Remove this item from cart?')) {
      await removeFromCart(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 bg-white transition-all hover:bg-slate-50/50">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="shrink-0 group">
        <div className="w-32 h-32 bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 text-center sm:text-left">
        <div className="mb-1">
           {product.category && (
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{product.category.name}</span>
          )}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="text-lg font-bold text-slate-900 hover:text-brand-600 transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-sm font-semibold text-slate-400 mt-1">
          ${parseFloat(product.price.toString()).toFixed(2)} per unit
        </p>
        
        <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-[11px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
          >
            Remove Item
          </button>
          {product.stock <= product.lowStockThreshold && (
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase tracking-wider">
              {product.stock} Left
            </span>
          )}
        </div>
      </div>

      {/* Right side Controls & Total */}
      <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
        <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-600 rounded-xl transition-all disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <span className="w-10 text-center font-bold text-slate-900">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading || quantity >= product.stock}
            className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-600 rounded-xl transition-all disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 tracking-tight">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
