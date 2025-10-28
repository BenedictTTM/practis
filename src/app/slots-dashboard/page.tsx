'use client';

import { useState, useEffect } from 'react';
import SlotBalance from '@/Components/slots/SlotBalance';
import PurchaseSlotsModal from '@/Components/slots/PurchaseSlotsModal';

/**
 * Example Dashboard Integration Page
 * 
 * This demonstrates how to integrate the slot purchase system into your dashboard.
 * You can copy this pattern into your existing dashboard page.
 */
export default function SlotsDashboardExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState(0);
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  // In production, get userId from your auth context/session
  useEffect(() => {
    // Example: Fetch current user
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUserId(data.user.id);
            setAvailableSlots(data.user.availableSlots || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handlePurchaseSuccess = () => {
    setIsModalOpen(false);
    // Optionally refresh slot balance or show success toast
    window.location.reload(); // Simple reload, or use your state management
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Slot Management</h1>
          <p className="text-gray-600">
            Manage your product listing slots. Purchase more slots to list additional products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Slot Balance */}
          <div className="lg:col-span-1">
            <SlotBalance
              userId={userId}
              onPurchaseClick={() => setIsModalOpen(true)}
              showPurchaseButton={true}
              autoRefresh={true}
              refreshInterval={60000} // Refresh every minute
            />

            {/* Additional Info Card */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 How Slots Work</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Each slot allows you to list one product</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Slots are reusable when you remove a product</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Price: GHS 1.00 per slot</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure payment via Paystack</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Slot Usage Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              
              {/* Placeholder for activity/transaction history */}
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-2">No recent activity</p>
                <p className="text-sm text-gray-400">Your slot purchase history will appear here</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Buy Slots</span>
              </button>

              <button
                onClick={() => window.location.href = '/products/new'}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Add Product</span>
              </button>

              <button
                onClick={() => window.location.href = '/products'}
                className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-4 px-6 rounded-lg transition-colors flex flex-col items-center gap-2"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span>My Products</span>
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Modal */}
        <PurchaseSlotsModal
          userId={userId}
          currentSlots={availableSlots}
          onSuccess={handlePurchaseSuccess}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      </div>
    </div>
  );
}
