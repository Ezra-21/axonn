/**
 * Admin Route Hook
 * Redirects non-admin users to home page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export function useAdminRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Redirect to home if not admin
    if (user?.role !== Role.ADMIN && user?.role !== Role.SUPER_ADMIN) {
      router.push('/');
    }
  }, [isAuthenticated, user, loading, router]);

  return { isAdmin: user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN, loading };
}


// redirects non-admin users to homepage with 403 toast