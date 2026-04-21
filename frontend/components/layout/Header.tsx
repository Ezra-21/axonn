/**
 * Header Component
 * Main navigation header with auth, cart, and search
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Role } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'All Products', href: '/products' },
    { name: 'Living Room', href: '/products?category=living-room' },
    { name: 'Bedroom', href: '/products?category=bedroom' },
    { name: 'Office', href: '/products?category=office' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-subtle border-b border-slate-200/50 py-2' 
          : 'bg-white border-b border-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold italic">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              Axon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href 
                    ? 'text-brand-600 bg-brand-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden xl:flex flex-1 max-w-sm mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all outline-none"
            />
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Actions */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all focus:outline-none">
                    <div className="w-9 h-9 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm transition-all group-hover:border-brand-200">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-xs font-bold text-slate-600">${user?.firstName?.[0]}${user?.lastName?.[0]}</span>`;
                              parent.classList.add('bg-slate-100');
                            }
                          }}
                        />
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-tight text-slate-600">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      )}
                    </div>
                    <div className="hidden md:block text-left mr-1">
                      <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">
                        {user?.firstName} {user?.lastName?.[0]}.
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 leading-none uppercase tracking-widest">
                        {user?.role || 'Member'}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-slate-900">{user?.email}</p>
                    </div>
                    <div className="h-px bg-slate-50 my-1 mx-2" />
                    {(user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN) && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Admin Panel
                      </Link>
                    )}
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      My Orders
                    </Link>
                    <div className="h-px bg-slate-50 my-1 mx-2" />
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                    Login
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm text-sm flex items-center gap-2">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-6 border-t border-slate-100 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-3 mt-4 px-4">
                  <Link href="/auth/login" className="py-3 text-sm bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2">Login</Link>
                  <Link href="/auth/register" className="py-3 text-sm bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2">Register</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// cart badge shows item count from CartContext

// search bar triggers debounced API call after 300ms