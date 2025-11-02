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

  const pricePerSlot = 1;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md max-h-[82vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="px-3 sm:px-6 pt-5 pb-3">
          <h2 className="text-[clamp(1.3rem,3vw,1.8rem)] font-bold text-gray-900">
            Purchase Product Slots
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            You have {currentSlots} slots available for purchase
          </p>
        </div>

        <div className="px-3 sm:px-6 py-3 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiShoppingBag className="w-4 h-4 text-red-500" />
              <label className="text-xs font-semibold text-gray-900">
                Select Quantity
              </label>
            </div>

            <div className="rounded-xl p-2 border border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of slots
              </label>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setSlots(Math.max(1, slots - 1))}
                  disabled={slots <= 1}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Decrease quantity"
                >
                  <FiMinusCircle className="w-5 h-5" />
                </button>

                <div className="min-w-[45px] sm:min-w-[65px] text-center">
                  <span className="text-[clamp(1.6rem,5vw,2rem)] font-semibold text-gray-800 select-none">
                    {slots}
                  </span>
                </div>

                <button
                  onClick={() => setSlots(Math.min(100, slots + 1))}
                  disabled={slots >= 100}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Increase quantity"
                >
                  <FiPlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <RiMoneyDollarCircleLine className="w-4 h-4 text-red-500" />
              <label className="text-xs font-semibold text-gray-900">
                Price Summary
              </label>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Price per slot</span>
                <span className="font-medium text-gray-900">GHS {pricePerSlot.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">GHS {totalCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">Total Price</span>
                  <span className="text-xl font-bold text-red-500">GHS {totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-[10px] text-gray-600 text-center">
              Your payment is securely processed by Paystack
            </p>
          </div>
        </div>

        {error && (
          <div className="px-3 sm:px-6 mb-3">
            <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="px-3 sm:px-6 pb-4 flex flex-col sm:flex-row gap-2">
          {onClose && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
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
