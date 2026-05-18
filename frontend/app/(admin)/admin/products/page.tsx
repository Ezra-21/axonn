/**
 * Admin Products Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Product } from '@/lib/types';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await adminApi.getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Link href="/admin/products/new" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Product</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center">Loading products...</td></tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] && <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-slate-900 truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{product.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${product.stock <= product.lowStockThreshold ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/products/${product.id}`} className="text-brand-600 hover:text-brand-700 font-medium text-sm">Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
