/**
 * Checkout Page
 * Order checkout with address and payment
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useProtectedRoute } from '@/lib/hooks';
import { userApi, ordersApi } from '@/lib/api';
import { Address, PaymentMethod } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();
  useProtectedRoute();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH_ON_DELIVERY);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ethiopia',
    isDefault: false,
  });

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userAddresses = await userApi.getAddresses();
        const addressList = Array.isArray(userAddresses) ? userAddresses : [];
        setAddresses(addressList);
        
        // Select default address or first address
        const defaultAddr = addressList.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (addressList.length > 0) {
          setSelectedAddressId(addressList[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddNewAddress = async () => {
    try {
      const address = await userApi.addAddress(newAddress);
      setAddresses([...addresses, address]);
      setSelectedAddressId(address.id);
      setShowNewAddressForm(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Ethiopia',
        isDefault: false,
      });
      toast.success('Address added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId && addresses.length > 0) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);

      // Create order
      const order = await ordersApi.create({
        addressId: selectedAddressId || undefined,
        paymentMethod,
        notes: notes || undefined,
      });

      // If payment method is Stripe, redirect to payment page
      if (paymentMethod === PaymentMethod.STRIPE) {
        router.push(`/orders/${order.id}/payment`);
      } else {
        // Clear cart and redirect to order confirmation
        await clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders/${order.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Checkout not possible</h2>
        <p className="text-slate-500 mb-10">Your cart is empty. Please add items to checkout.</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 px-10"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Link href="/cart" className="hover:text-brand-600 transition-colors">Cart</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-600">Checkout Process</span>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Complete Your Order</h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">1. Delivery Address</h2>
                {!showNewAddressForm && (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-bold text-brand-600 uppercase tracking-widest hover:text-brand-700"
                  >
                    + New Address
                  </button>
                )}
              </div>
              
              {showNewAddressForm ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top duration-300">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Luxury Lane"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                      <input
                        type="text"
                        placeholder="Addis Ababa"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State</label>
                      <input
                        type="text"
                        placeholder="Region"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button onClick={handleAddNewAddress} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 px-8">Save Address</button>
                    <button onClick={() => setShowNewAddressForm(false)} className="bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 px-8">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(addresses ?? []).map((address) => (
                    <label
                      key={address.id}
                      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedAddressId === address.id
                          ? 'border-brand-600 bg-brand-50/30 ring-4 ring-brand-500/5'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedAddressId === address.id ? 'border-brand-600 bg-brand-600' : 'border-slate-200 bg-white'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 mb-1">{address.street}</div>
                          <div className="text-xs text-slate-500 font-medium leading-relaxed">
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          {address.isDefault && (
                            <span className="inline-block mt-2 text-[10px] font-bold text-brand-600 uppercase tracking-widest">Default</span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                  {addresses.length === 0 && (
                    <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-slate-400 text-sm font-medium mb-4">No shipping addresses found.</p>
                      <button onClick={() => setShowNewAddressForm(true)} className="bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-2 text-xs">Add First Address</button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">2. Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: PaymentMethod.CASH_ON_DELIVERY, name: 'Cash on Delivery', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                  { id: PaymentMethod.STRIPE, name: 'Credit / Debit Card', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                  { id: PaymentMethod.MOBILE_PAYMENT, name: 'Mobile Money', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                  { id: PaymentMethod.BANK_TRANSFER, name: 'Bank Transfer', icon: 'M8 14v20m4-20v20m4-20v20M3 12h18L12 3 3 12z' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === method.id
                        ? 'border-brand-600 bg-brand-50/30 ring-4 ring-brand-500/5'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        paymentMethod === method.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={method.icon} /></svg>
                      </div>
                      <div className="font-bold text-slate-900">{method.name}</div>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Notes */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">3. Order Notes <span className="text-xs text-slate-400 font-medium ml-2">(Optional)</span></h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific delivery instructions or gift messages?"
                rows={4}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none resize-none py-4"
              />
            </section>
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-1 sticky top-28">
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
              <h2 className="text-xl font-bold mb-8">Review Order</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {(cart?.items ?? []).map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden shrink-0">
                      {item.product.images[0] && (
                        <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.product.name}</p>
                      <p className="text-slate-400 text-xs mt-1">Quantity: {item.quantity}</p>
                      <p className="text-brand-400 font-bold text-sm mt-1">
                        ${(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8 space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    <p className="text-3xl font-bold tracking-tight text-brand-400">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || (!selectedAddressId && addresses.length > 0)}
                className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-5 text-base font-bold shadow-2xl shadow-brand-500/20"
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </button>
              
              <p className="text-[10px] text-slate-500 text-center mt-6 font-medium leading-relaxed px-4">
                By placing your order, you agree to our Terms of Use and Sale and our Privacy Policy.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
