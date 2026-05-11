/**
 * Order Detail Page
 * View individual order details
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/lib/hooks';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  useProtectedRoute();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await ordersApi.getById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const updatedOrder = await ordersApi.cancel(orderId);
      setOrder(updatedOrder);
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-700 border-amber-100';
      case OrderStatus.CONFIRMED: return 'bg-brand-50 text-brand-700 border-brand-100';
      case OrderStatus.PROCESSING: return 'bg-purple-50 text-purple-700 border-purple-100';
      case OrderStatus.SHIPPED: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case OrderStatus.CANCELLED: return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
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
          <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Order not found</h2>
        <p className="text-slate-500 mb-10">We couldn't find the order you're looking for.</p>
        <button onClick={() => router.push('/orders')} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 px-10">Back to My Orders</button>
      </div>
    );
  }

  const canCancel = [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Link href="/orders" className="hover:text-brand-600 transition-colors">My Orders</Link>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-slate-600">Details</span>
              </nav>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order #{order.orderNumber}</h1>
              <p className="text-slate-500 font-medium mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                >
                  {cancelling ? 'Processing...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Items */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h2 className="text-xl font-bold text-slate-900">Order Items</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex gap-6 p-8 items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-1">{item.productName}</h3>
                      <p className="text-xs text-slate-500 font-medium">Quantity: {item.quantity}</p>
                      <p className="text-sm font-bold text-brand-600 mt-2">${parseFloat(item.unitPrice.toString()).toFixed(2)} / unit</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg text-slate-900">${parseFloat(item.totalPrice.toString()).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping */}
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Shipping Address</h2>
                {order.shippingAddress ? (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">{order.shippingAddress.street}</p>
                      <p className="text-sm text-slate-500 font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p className="text-sm text-slate-400 font-medium">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                ) : <p className="text-slate-400 italic text-sm">No address provided.</p>}
              </section>

              {/* Notes */}
              <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Order Notes</h2>
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  {order.notes || "No special instructions provided for this order."}
                </p>
              </section>
            </div>
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:col-span-1 sticky top-28">
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
              <h2 className="text-xl font-bold mb-8">Payment Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-bold">${parseFloat(order.subtotal.toString()).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className="font-bold">${parseFloat(order.shippingCost.toString()).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax</span>
                  <span className="font-bold">${parseFloat(order.tax.toString()).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Discount</span>
                    <span className="text-brand-400 font-bold">-${parseFloat(order.discount.toString()).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Total Paid</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold tracking-tight text-brand-400">${parseFloat(order.totalAmount.toString()).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                  <span className="text-xs font-bold">{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    order.paymentStatus === PaymentStatus.PAID ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
