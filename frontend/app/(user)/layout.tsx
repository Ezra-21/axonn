/**
 * User Layout
 * Layout for all user-facing pages (Storefront)
 */

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
