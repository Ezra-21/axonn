/**
 * Cart Page
 * Shopping cart with items and checkout
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useProtectedRoute } from '@/lib/hooks';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  
  // Protect this route
  useProtectedRoute();

  if (!isAuthenticated) {
    return null; // Will redirect via useProtectedRoute
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium">Loading your selection...</p>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items ?? [];
  
  if (!cart || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-[2.5rem] mb-8 text-slate-300">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added anything to your cart yet. Browse our collection to find something special.
        </p>
        <Link
          href="/products"
          className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 inline-flex"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-slate-600">Shopping Cart</span>
              </nav>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Your Cart</h1>
            </div>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="divide-y divide-slate-50">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-600 transition-all ml-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 sticky top-28">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium text-sm">Subtotal ({cartItems.length} items)</span>
                  <span className="text-slate-900 font-bold text-sm">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium text-sm">Shipping</span>
                  <span className="text-emerald-600 font-bold text-sm uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-1 rounded-lg">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium text-sm">Est. Tax</span>
                  <span className="text-slate-400 font-medium text-sm">--</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-slate-900 font-bold">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">${totalAmount.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Including VAT</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-5 text-base font-bold shadow-2xl shadow-brand-200 mb-6"
              >
                Checkout Now
              </button>
              
              <div className="flex items-center justify-center gap-4 grayscale opacity-40">
                <div className="text-[10px] font-bold tracking-tighter">VISA</div>
                <div className="text-[10px] font-bold tracking-tighter">STRIPE</div>
                <div className="text-[10px] font-bold tracking-tighter">APPLE PAY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
