'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { FiPlusCircle, FiMinusCircle, FiShoppingBag } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { slotService } from '@/services/slotService';

interface PurchaseSlotsModalProps {
  userId: number;
  currentSlots: number;
  onSuccess?: () => void;
  onClose?: () => void;
  isOpen: boolean;
}

export default function PurchaseSlotsModal({
  userId,
  currentSlots,
  onSuccess,
  onClose,
  isOpen,
}: PurchaseSlotsModalProps) {
  const [slots, setSlots] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerSlot = 1; // GHS 1.00 per slot
  const totalCost = slotService.calculateCost(slots, pricePerSlot);

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await slotService.purchaseSlots(userId, slots);

      if (result.success && result.authorization?.authorization_url) {
        window.location.href = result.authorization.authorization_url;
      } else {
        setError(result.error || 'Failed to initialize payment');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Purchase Product Slots</h2>
          <p className="text-sm text-gray-500 mt-1">
            You have {currentSlots} slots available for purchase
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Slot Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiShoppingBag className="w-5 h-5 text-red-500" />
              <label className="text-sm font-semibold text-gray-900">
                Select Quantity
              </label>
            </div>

            {/* Improved Number of Slots Section */}
            <div className="rounded-xl p-2 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of slots
              </label>

              <div className="flex items-center justify-center gap-6">
                {/* Decrease Button */}
                <button
                  onClick={() => setSlots(Math.max(1, slots - 1))}
                  disabled={slots <= 1}
                  className="w-12 h-12 flex items-center justify-center  disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Decrease quantity"
                >
                  <FiMinusCircle className="w-6 h-6" />
                </button>

                {/* Slot Number */}
                <div className="min-w-[70px] text-center">
                  <span className="text-3xl font-semibold text-gray-800 select-none">
                    {slots}
                  </span>
                </div>

                {/* Increase Button */}
                <button
                  onClick={() => setSlots(Math.min(100, slots + 1))}
                  disabled={slots >= 100}
                  className="w-12 h-12 flex items-center justify-center   disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Increase quantity"
                >
                  <FiPlusCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RiMoneyDollarCircleLine className="w-5 h-5 text-red-500" />
              <label className="text-sm font-semibold text-gray-900">
                Price Summary
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Price per slot</span>
                <span className="font-medium text-gray-900">GHS {pricePerSlot.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">GHS {totalCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-red-500">GHS {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              Your payment is securely processed by Paystack
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex-1 px-5 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
