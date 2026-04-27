/**
 * Register Form Component
 * User registration form with validation and error display
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { ApiError } from '@/lib/api/client';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>('');

  // Client-side validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(''); // Clear previous API error
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await register(formData);
      router.push('/'); // Redirect to home/dashboard after registration
    } catch (error) {
      // Handle API errors and show in UI
      if (error instanceof ApiError) {
        // Map validation errors to form fields
        if (error.errors && error.errors.length > 0) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        }
        setApiError(error.message);
      } else if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  return (
    <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-2xl mb-6 text-brand-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500 text-sm">Join Axon today for exclusive deals.</p>
        </div>
        
        {/* API Error Alert */}
        {apiError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-xs font-medium leading-relaxed">{apiError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.firstName ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.lastName ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Phone Number <span className="text-[10px] text-slate-400 font-normal ml-1">(Optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.phone ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="+251 ..."
              />
              {errors.phone && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.password ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 placeholder:text-slate-400 transition-all outline-none ${errors.confirmPassword ? 'border-red-300' : 'border-slate-200'}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 ml-1 text-[11px] font-bold text-red-500 uppercase tracking-tighter italic">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed ml-1">
            Password must be at least 8 characters and include a mix of uppercase, lowercase, and numbers.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 w-full py-4 text-base shadow-xl shadow-brand-200 font-bold tracking-tight mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Get Started'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-bold transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// validate password strength: min 8 chars, 1 uppercase, 1 number