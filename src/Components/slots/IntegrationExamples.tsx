/**
 * Integration Examples - Copy these patterns into your existing components
 */

'use client';

import { useState, useEffect } from 'react';
import SlotIndicator from '@/Components/slots/SlotIndicator';
import PurchaseSlotsModal from '@/Components/slots/PurchaseSlotsModal';
import SlotBalance from '@/Components/slots/SlotBalance';
import { slotService } from '@/services/slotService';

// ============================================================================
// Example 1: Navigation Bar Integration
// ============================================================================

export function NavbarWithSlots({ userId }: { userId: number }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold">Sellr</div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </a>

            {/* Slot Indicator - Compact variant for navbar */}
            <SlotIndicator
              userId={userId}
              onClick={() => setIsPurchaseModalOpen(true)}
              variant="compact"
              showLabel={true}
            />
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseSlotsModal
        userId={userId}
        currentSlots={0} // Will be fetched by component
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={() => {
          setIsPurchaseModalOpen(false);
          // Optional: Show success toast
          alert('Slots purchased successfully!');
        }}
      />
    </nav>
  );
}

// ============================================================================
// Example 2: Dashboard Sidebar Integration
// ============================================================================

export function DashboardSidebarWithSlots({ userId }: { userId: number }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <aside className="w-64 bg-gray-50 h-screen p-4">
      {/* Sidebar Navigation */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-200">
              Overview
            </a>
          </li>
          <li>
            <a href="/products" className="block px-3 py-2 rounded hover:bg-gray-200">
              Products
            </a>
          </li>
          <li>
            <a href="/orders" className="block px-3 py-2 rounded hover:bg-gray-200">
              Orders
            </a>
          </li>
        </ul>
      </div>

      {/* Slot Balance Widget */}
      <SlotBalance
        userId={userId}
        onPurchaseClick={() => setIsPurchaseModalOpen(true)}
        showPurchaseButton={true}
        autoRefresh={true}
      />

      {/* Purchase Modal */}
      <PurchaseSlotsModal
        userId={userId}
        currentSlots={0}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </aside>
  );
}

// ============================================================================
// Example 3: Product Listing Page with Slot Check
// ============================================================================

export function ProductListingPageWithSlotCheck({ userId }: { userId: number }) {
  const [availableSlots, setAvailableSlots] = useState<number | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      const data = await slotService.getUserSlots(userId);
      if (data) {
        setAvailableSlots(data.availableSlots);
      }
    };
    fetchSlots();
  }, [userId]);

  const handleListProduct = () => {
    if (availableSlots === null) {
      alert('Loading slot information...');
      return;
    }

    if (availableSlots === 0) {
      // Show purchase modal instead of form
      setIsPurchaseModalOpen(true);
    } else {
      // Show product listing form
      setShowForm(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">List New Product</h1>
          
          {/* Slot Status Badge */}
          {availableSlots !== null && (
            <div className={`px-4 py-2 rounded-lg ${
              availableSlots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className="text-sm font-semibold">
                {availableSlots} {availableSlots === 1 ? 'slot' : 'slots'} available
              </span>
            </div>
          )}
        </div>

        {/* No Slots Warning */}
        {availableSlots === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  No Available Slots
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  You need to purchase slots before you can list new products. Each slot allows you to list one product.
                </p>
                <button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Purchase Slots Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Form or CTA */}
        {showForm && availableSlots && availableSlots > 0 ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter product title"
              />
            </div>
            {/* Add more form fields... */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              List Product
            </button>
          </form>
        ) : (
          <button
            onClick={handleListProduct}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            disabled={availableSlots === null}
          >
            {availableSlots === null
              ? 'Loading...'
              : availableSlots === 0
              ? 'Purchase Slots to Continue'
              : 'Start Listing Product'}
          </button>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseSlotsModal
        userId={userId}
        currentSlots={availableSlots || 0}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={() => {
          setIsPurchaseModalOpen(false);
          // Refresh slot count
          window.location.reload();
        }}
      />
    </div>
  );
}

// ============================================================================
// Example 4: Settings/Profile Page Integration
// ============================================================================

export function SettingsPageWithSlots({ userId }: { userId: number }) {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          {/* Settings form fields... */}
        </div>

        {/* Slot Management Card */}
        <div className="lg:col-span-1">
          <SlotBalance
            userId={userId}
            onPurchaseClick={() => setIsPurchaseModalOpen(true)}
            showPurchaseButton={true}
          />
        </div>
      </div>

      <PurchaseSlotsModal
        userId={userId}
        currentSlots={0}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}

// ============================================================================
// Example 5: Using the Slot Service Directly (Advanced)
// ============================================================================

export async function customSlotPurchaseFlow(userId: number, slots: number) {
  try {
    // 1. Check current slots
    const currentSlots = await slotService.getUserSlots(userId);
    console.log('Current slots:', currentSlots);

    // 2. Calculate cost
    const cost = slotService.calculateCost(slots);
    console.log(`Cost for ${slots} slots: GHS ${cost}`);

    // 3. Initiate purchase
    const result = await slotService.purchaseSlots(userId, slots);

    if (result.success && result.authorization) {
      // 4. Redirect to Paystack
      window.location.href = result.authorization.authorization_url;
    } else {
      console.error('Purchase failed:', result.error);
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Purchase error:', error);
    alert('Failed to purchase slots. Please try again.');
  }
}

// ============================================================================
// Example 6: React Hook for Slot Management (Custom Hook)
// ============================================================================

export function useSlots(userId: number) {
  const [slots, setSlots] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await slotService.getUserSlots(userId);
      if (data) {
        setSlots(data.availableSlots);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [userId]);

  const purchaseSlots = async (quantity: number) => {
    const result = await slotService.purchaseSlots(userId, quantity);
    if (result.success && result.authorization) {
      window.location.href = result.authorization.authorization_url;
    }
    return result;
  };

  return {
    slots,
    isLoading,
    error,
    refetch: fetchSlots,
    purchaseSlots,
  };
}

// Usage in component:
export function ComponentUsingHook({ userId }: { userId: number }) {
  const { slots, isLoading, purchaseSlots } = useSlots(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Available Slots: {slots}</p>
      <button onClick={() => purchaseSlots(5)}>
        Buy 5 Slots
      </button>
    </div>
  );
}
