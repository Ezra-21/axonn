/**
 * Admin Create Product Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminApi.getCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || formData.name.length < 3) {
      toast.error('Product name must be at least 3 characters');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than zero');
      return;
    }
    if (!formData.description || formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await adminApi.createProduct(formData);
      if (response.success) {
        toast.success('Product created successfully');
        router.push('/admin/products');
      } else {
        toast.error(response.message || 'Failed to create product');
      }
    } catch (err: any) {
      console.error('Detailed Error:', err);
      
      // If it's a validation error with an errors array
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        const firstError = err.errors[0];
        toast.error(`${firstError.message}`);
      } else {
        toast.error(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-all">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
              placeholder="Enter product name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select 
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Price ($)</label>
            <input 
              required
              type="number" 
              min="0.01"
              step="0.01"
              value={Number.isNaN(formData.price) ? '' : formData.price}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({...formData, price: isNaN(val) ? 0 : val});
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Initial Stock</label>
            <input 
              required
              type="number" 
              min="0"
              value={Number.isNaN(formData.stock) ? '' : formData.stock}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFormData({...formData, stock: isNaN(val) ? 0 : val});
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Description</label>
          <textarea 
            required
            minLength={10}
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all"
            placeholder="Describe the product details (min 10 characters)..."
          />
          {formData.description.length > 0 && formData.description.length < 10 && (
            <p className="text-xs text-red-500 font-medium">Description must be at least 10 characters.</p>
          )}
        </div>

        <div className="flex items-center gap-8 py-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Active Listing</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={formData.isFeatured}
              onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Featured Product</span>
          </label>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            type="submit"
            className="flex-1 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
