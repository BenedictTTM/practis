'use client';

import { useState } from 'react';
import ProtectedRoute from '@/Components/Auth/ProtectedRoute';
import VerticalNavigation from '@/Components/Navigation/verticalProductNav';
import Footer from '@/Components/Footer/footer';
import TopBar from '../../Components/Header/topbar';
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
      {/* Top bar at the top */}
      <div className="relative z-50">
        <TopBar />
      </div>

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

        {/* Sidebar drawer for mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
          <VerticalNavigation />
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
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
