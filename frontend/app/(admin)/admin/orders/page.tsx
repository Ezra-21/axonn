/**
 * Admin Orders Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminApi.getOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Order ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center">Loading orders...</td></tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">#{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{order.user?.firstName} {order.user?.lastName}</div>
                    <div className="text-xs text-slate-500">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${order.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-brand-600 hover:text-brand-700 font-medium text-sm">View Details</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
