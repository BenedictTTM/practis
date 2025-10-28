'use client';

import { useState, useEffect } from 'react';
import { slotService } from '@/services/slotService';

interface SlotIndicatorProps {
  userId: number;
  onClick?: () => void;
  showLabel?: boolean;
  variant?: 'compact' | 'full';
}

/**
 * Compact Slot Indicator Component
 * 
 * Perfect for navigation bars or headers to show quick slot status.
 * Can be clicked to open purchase modal or navigate to slots page.
 */
export default function SlotIndicator({
  userId,
  onClick,
  showLabel = true,
  variant = 'compact',
}: SlotIndicatorProps) {
  const [slots, setSlots] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      const data = await slotService.getUserSlots(userId);
      if (data) {
        setSlots(data.availableSlots);
      }
      setIsLoading(false);
    };

    fetchSlots();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        {showLabel && variant === 'full' && (
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        )}
      </div>
    );
  }

  const getStatusColor = (available: number) => {
    if (available === 0) return 'bg-red-500 text-red-700';
    if (available <= 3) return 'bg-yellow-500 text-yellow-700';
    return 'bg-green-500 text-green-700';
  };

  const getStatusBgColor = (available: number) => {
    if (available === 0) return 'bg-red-50 border-red-200';
    if (available <= 3) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-md ${
          slots !== null ? getStatusBgColor(slots) : 'bg-gray-50 border-gray-200'
        }`}
        title={`${slots || 0} available slots`}
      >
        <div className="relative">
          <svg
            className={`w-5 h-5 ${
              slots !== null && slots > 0 ? 'text-gray-700' : 'text-gray-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          
          {/* Status dot */}
          {slots !== null && (
            <span
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                slots === 0
                  ? 'bg-red-500'
                  : slots <= 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            ></span>
          )}
        </div>

        {showLabel && (
          <span className="text-sm font-semibold text-gray-900">
            {slots !== null ? slots : '–'}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border transition-all hover:shadow-md ${
        slots !== null ? getStatusBgColor(slots) : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>

        <div className="text-left">
          {showLabel && (
            <p className="text-xs font-medium text-gray-600">Available Slots</p>
          )}
          <p className="text-2xl font-bold text-gray-900">
            {slots !== null ? slots : '–'}
          </p>
        </div>
      </div>

      {slots !== null && slots <= 3 && (
        <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{slots === 0 ? 'No slots' : 'Low'}</span>
        </div>
      )}
    </button>
  );
}
