/**
 * Orders List Page
 * View all user orders
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/lib/hooks';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import OrderCard from '@/components/orders/OrderCard';
import Link from 'next/link';

export default function OrdersPage() {
  useProtectedRoute();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = filter !== 'ALL' ? { status: filter } : {};
        const response = await ordersApi.getMyOrders(params);
        const ordersData = response?.data ?? [];
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Fetching your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-600">Order History</span>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">My Orders</h1>
          <p className="text-slate-500 font-medium">Track your furniture from workshop to home.</p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              filter === 'ALL'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900'
            }`}
          >
            All Orders
          </button>
          {Object.values(OrderStatus).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all uppercase tracking-wider ${
                filter === status
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                  : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-20 text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-[2.5rem] mb-8 text-slate-200">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">No orders found</h2>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed mb-10">
              {filter !== 'ALL'
                ? `You don't have any ${filter.toLowerCase()} orders at the moment.`
                : "You haven't placed any orders with us yet. Start decorating your home today!"}
            </p>
            <Link href="/products" className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 inline-flex">Explore Catalog</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {(orders ?? []).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
