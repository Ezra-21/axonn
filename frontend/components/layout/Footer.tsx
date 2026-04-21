/**
 * Footer Component
 * Site-wide footer with links and information
 */

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl font-bold italic">A</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Axon
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Handcrafting premium furniture that combines modern aesthetics with unparalleled comfort for your dream space.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Catalog</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-sm hover:text-brand-500 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=living-room" className="text-sm hover:text-brand-500 transition-colors">Living Room</Link></li>
              <li><Link href="/products?category=bedroom" className="text-sm hover:text-brand-500 transition-colors">Bedroom</Link></li>
              <li><Link href="/products?category=office" className="text-sm hover:text-brand-500 transition-colors">Office Furniture</Link></li>
              <li><Link href="/products?isFeatured=true" className="text-sm hover:text-brand-500 transition-colors">Featured Pieces</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/orders" className="text-sm hover:text-brand-500 transition-colors">Track Your Order</Link></li>
              <li><Link href="/profile" className="text-sm hover:text-brand-500 transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="text-sm hover:text-brand-500 transition-colors">Shopping Cart</Link></li>
              <li><Link href="#" className="text-sm hover:text-brand-500 transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-brand-500 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm leading-relaxed">Addis Ababa, Ethiopia<br/>Bole Sub-city, Woreda 03</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-sm">support@axon.com</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-5 h-5 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span className="text-sm">+251 11 XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {currentYear} Axon. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// footer links: About, Contact, Privacy Policy, Terms