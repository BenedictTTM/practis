'use client';

import { useState } from 'react';
import ProtectedRoute from '@/Components/Auth/ProtectedRoute';
import VerticalNavigation from '@/Components/Navigation/verticalProductNav';
import MobileNavigation from '@/Components/Navigation/mobileNav';
import Footer from '@/Components/Footer/footer';
import { Menu } from 'lucide-react';

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white">

      {/* Mobile toggle button (only visible on small screens) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white lg:hidden">
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle dashboard navigation"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 relative">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:flex w-64 bg-gray-50 border-r border-gray-200">
          <VerticalNavigation />
        </aside>

        {/* Mobile Navigation Sidebar (slide-in from right) */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <MobileNavigation onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Backdrop overlay for mobile nav */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
          {children}
        </main>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
    </ProtectedRoute>
  );
}
