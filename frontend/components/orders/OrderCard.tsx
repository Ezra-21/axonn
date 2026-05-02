/**
 * Order Card Component
 * Displays a single order in the orders list
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  // Status badge colors
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case OrderStatus.CONFIRMED:
        return 'bg-brand-50 text-brand-700 border-brand-100';
      case OrderStatus.PROCESSING:
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case OrderStatus.DELIVERED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case OrderStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'text-emerald-600';
      case PaymentStatus.PENDING:
        return 'text-amber-600';
      case PaymentStatus.FAILED:
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <Link href={`/orders/${order.id}`} className="group block">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <span
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Ref</p>
          <h3 className="font-bold text-xl text-slate-900 leading-none">#{order.orderNumber}</h3>
          <p className="text-xs text-slate-500 font-medium mt-3">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Order Items Preview */}
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
            </p>
          </div>
          <div className="flex -space-x-3">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="w-12 h-12 rounded-xl bg-white border-2 border-slate-50 overflow-hidden shadow-sm shrink-0"
              >
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="w-12 h-12 rounded-xl bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm shrink-0">
                +{order.items.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Financials */}
        <div className="space-y-3 pt-6 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</span>
            <span className="font-bold text-slate-900">${parseFloat(order.totalAmount.toString()).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 flex items-center justify-between group/link">
          <span className="text-xs font-bold text-brand-600 group-hover/link:translate-x-1 transition-transform">View full details &rarr;</span>
          {order.paymentMethod && (
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{order.paymentMethod}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// format currency with Intl.NumberFormat for locale support