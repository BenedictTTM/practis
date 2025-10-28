'use client';

import { useState, useEffect } from 'react';
import { slotService } from '@/services/slotService';

interface SlotBalanceProps {
  userId: number;
  onPurchaseClick?: () => void;
  showPurchaseButton?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function SlotBalance({
  userId,
  onPurchaseClick,
  showPurchaseButton = true,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: SlotBalanceProps) {
  const [slots, setSlots] = useState<{
    availableSlots: number;
    usedSlots: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async () => {
    try {
      setError(null);
      const data = await slotService.getUserSlots(userId);
      if (data) {
        setSlots(data);
      } else {
        setError('Failed to fetch slot information');
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('An error occurred while fetching slots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();

    if (autoRefresh) {
      const interval = setInterval(fetchSlots, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [userId, autoRefresh, refreshInterval]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error || !slots) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 text-sm">{error || 'Unable to load slot information'}</p>
        <button
          onClick={fetchSlots}
          className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalSlots = slots.availableSlots + slots.usedSlots;
  const usagePercentage = totalSlots > 0 ? (slots.usedSlots / totalSlots) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Product Slots</h3>
        <button
          onClick={fetchSlots}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Refresh slots"
          title="Refresh"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Slot Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Available</p>
          <p className="text-3xl font-bold text-green-600">{slots.availableSlots}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">In Use</p>
          <p className="text-3xl font-bold text-blue-600">{slots.usedSlots}</p>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-700">Slot Usage</span>
          <span className="text-xs font-semibold text-gray-900">
            {slots.usedSlots} / {totalSlots}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Warning/Info Messages */}
      {slots.availableSlots === 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            No available slots! Purchase more to list new products.
          </p>
        </div>
      )}

      {slots.availableSlots > 0 && slots.availableSlots <= 3 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Running low on slots. Consider purchasing more!
          </p>
        </div>
      )}

      {/* Purchase Button */}
      {showPurchaseButton && onPurchaseClick && (
        <button
          onClick={onPurchaseClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Purchase More Slots
        </button>
      )}
    </div>
  );
}
