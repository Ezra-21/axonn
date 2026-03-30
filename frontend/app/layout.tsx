/**
 * Root Layout
 * Base layout wrapper for the entire application
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Axon - Quality Furniture for Your Home',
  description: 'Shop quality furniture for your home and office. Browse our collection of living room, bedroom, and office furniture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} selection:bg-brand-100 selection:text-brand-700`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// global metadata: Open Graph tags for social sharing