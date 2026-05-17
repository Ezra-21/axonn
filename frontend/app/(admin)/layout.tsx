/**
 * Admin Layout
 * Layout for all admin-facing pages
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

// Simple SVG Icons
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Products: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Orders: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Categories: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 11h.01M7 15h.01M11 7h8m-8 4h8m-8 4h8" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: Icons.Dashboard },
    { name: 'Products', href: '/admin/products', icon: Icons.Products },
    { name: 'Categories', href: '/admin/categories', icon: Icons.Categories },
    { name: 'Orders', href: '/admin/orders', icon: Icons.Orders },
    { name: 'Users', href: '/admin/users', icon: Icons.Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <span className="text-lg font-bold italic">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Axon Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === item.href
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Icons.Home />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <Icons.Logout />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile/Profile */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <span className="text-lg font-bold italic">A</span>
              </div>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-sm font-medium">
            {pathname.split('/').filter(Boolean).map((part, i, arr) => {
              const href = `/${arr.slice(0, i + 1).join('/')}`;
              const isLast = i === arr.length - 1;
              return (
                <React.Fragment key={part}>
                  {i > 0 && <span className="text-slate-300">/</span>}
                  {isLast ? (
                    <span className="capitalize text-slate-400">{part}</span>
                  ) : (
                    <Link href={href} className="capitalize text-slate-600 hover:text-brand-600 transition-colors">
                      {part}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
