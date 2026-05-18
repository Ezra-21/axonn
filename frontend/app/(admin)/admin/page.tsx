/**
 * Admin Dashboard Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAdminRoute } from '@/lib/hooks';
import { adminApi, DashboardStats } from '@/lib/api';
import Link from 'next/link';

// Simple SVG Icons
const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Box: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Activity: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
};

export default function AdminDashboard() {
  const { loading: authLoading } = useAdminRoute();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (authLoading) return;
      try {
        const data = await adminApi.getDashboardStats();
        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authLoading]);

  if (authLoading || (loading && !stats)) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats?.counts?.users || 0, 
      icon: Icons.Users, 
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/users'
    },
    { 
      name: 'Products', 
      value: stats?.counts?.products || 0, 
      icon: Icons.Box, 
      color: 'bg-indigo-50 text-indigo-600',
      href: '/admin/products'
    },
    { 
      name: 'Total Orders', 
      value: stats?.counts?.orders || 0, 
      icon: Icons.ShoppingCart, 
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/orders'
    },
    { 
      name: 'Total Revenue', 
      value: `$${(stats?.revenue?.total || 0).toLocaleString()}`, 
      icon: Icons.TrendingUp, 
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/sales'
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
              <Icons.Activity />
              Reports
            </button>
            <Link href="/admin/products/new" className="px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-200 flex items-center gap-2">
              <Icons.Box />
              Add Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
            <Icons.AlertCircle />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => (
            <Link 
              key={card.name} 
              href={card.href}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon />
                </div>
                <Icons.ArrowRight />
              </div>
              <p className="text-slate-500 text-sm font-medium mb-1">{card.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <Link href="/admin/orders" className="text-brand-600 text-sm font-bold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">#{order.orderNumber}</td>
                        <td className="px-6 py-4 text-slate-600">{order.user?.firstName} {order.user?.lastName}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">${order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                            order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-medium">No recent orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Inventory Alerts</h3>
              <Link href="/admin/products?stock=low" className="text-brand-600 text-sm font-bold hover:underline">Manage</Link>
            </div>
            <div className="p-6 space-y-6">
              {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Icons.Box />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.stock} units remaining</p>
                    </div>
                    <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                      Low
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icons.Box />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">All stock levels healthy!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
