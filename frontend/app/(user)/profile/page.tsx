/**
 * Profile Page
 * User profile management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useProtectedRoute } from '@/lib/hooks';
import { useAuth } from '@/lib/context/AuthContext';
import { userApi, authApi } from '@/lib/api';
import { Address } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  useProtectedRoute();
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password'>('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ethiopia',
    isDefault: false,
  });

  // Fetch addresses
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    try {
      const data = await userApi.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setAddresses([]);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await userApi.updateProfile(profileForm);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Add/Edit address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAddressId) {
        await userApi.updateAddress(editingAddressId, addressForm);
        toast.success('Address updated successfully');
      } else {
        await userApi.addAddress(addressForm);
        toast.success('Address added successfully');
      }
      await fetchAddresses();
      resetAddressForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await userApi.deleteAddress(id);
      toast.success('Address deleted successfully');
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  // Edit address
  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Ethiopia',
      isDefault: false,
    });
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24">
      <div className="bg-white border-b border-slate-100 py-12 mb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-600">My Profile</span>
          </nav>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-200 overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={`${user.firstName} ${user.lastName}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span>${user?.firstName?.[0]}${user?.lastName?.[0]}</span>`;
                    }}
                  />
                ) : (
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all text-slate-600">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        toast.loading('Uploading...', { id: 'avatar-upload' });
                        const updatedUser = await userApi.updateAvatar(file);
                        updateUser(updatedUser);
                        toast.success('Avatar updated!', { id: 'avatar-upload' });
                      } catch (err: any) {
                        toast.error(err.message || 'Upload failed', { id: 'avatar-upload' });
                      }
                    }
                  }} 
                />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </label>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-500 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Tabs Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Shipping Addresses
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === 'password'
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Change Password
                </button>
              </nav>
            </div>
          </aside>

          {/* Tab Content */}
          <main className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1.5 opacity-60">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Unchangeable)</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none bg-slate-50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                        placeholder="+251 ..."
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-12 font-bold shadow-lg shadow-brand-200">
                    {loading ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-bold text-slate-900">Shipping Addresses</h2>
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold shadow-lg shadow-brand-200">
                      Add New Address
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <h2 className="text-xl font-bold text-slate-900 mb-8">
                      {editingAddressId ? 'Edit Address' : 'New Address'}
                    </h2>
                    <form onSubmit={handleSaveAddress} className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                          placeholder="e.g. Bole Road, House #123"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                          <input
                            type="text"
                            required
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">State / Region</label>
                          <input
                            type="text"
                            required
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                          <input
                            type="text"
                            required
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Country</label>
                          <input
                            type="text"
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-1">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-brand-600 peer-checked:border-brand-600 transition-all"></div>
                          <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <label htmlFor="isDefault" className="text-sm font-medium text-slate-600 cursor-pointer">Set as default shipping address</label>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={loading} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 font-bold shadow-lg shadow-brand-200">
                          {loading ? 'Saving...' : 'Save Address'}
                        </button>
                        <button type="button" onClick={resetAddressForm} className="bg-white text-slate-700 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 py-4 px-10 font-bold">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(addresses ?? []).map((address) => (
                    <div key={address.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                      {address.isDefault && (
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl">
                          Default
                        </div>
                      )}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 mb-1">{address.street}</p>
                          <p className="text-sm text-slate-500 font-medium">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-sm text-slate-400 font-medium">{address.country}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 pl-16">
                        <button onClick={() => handleEditAddress(address)} className="text-xs font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest transition-colors">Edit</button>
                        <button onClick={() => handleDeleteAddress(address.id)} className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="md:col-span-2 text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium mb-4">You haven't saved any addresses yet.</p>
                      <button onClick={() => setShowAddressForm(true)} className="text-brand-600 font-bold uppercase tracking-widest text-xs hover:text-brand-700">Add your first address</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 animate-in fade-in duration-500 max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-4 font-bold shadow-lg shadow-brand-200 mt-4">
                    {loading ? 'Processing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
