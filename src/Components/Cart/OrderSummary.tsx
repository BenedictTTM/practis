'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatGhs } from '@/utilities/formatGhs';

/**
 * OrderSummary Component
 * 
 * Fully responsive, accessible, and modular
 * Uses Tailwind responsive utilities for adaptive scaling
 */

interface OrderSummaryProps {
  subtotal: number;
  isAuthenticated: boolean;
  onCheckout: () => void;
  className?: string;
}

export default function OrderSummary({
  subtotal,
  isAuthenticated,
  onCheckout,
  className = '',
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Shipping calculation logic
  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      console.log('Applying coupon:', couponCode);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 p-4 sm:p-6 md:p-8 max-w-lg mx-auto w-full transition-all ${className}`}
    >
      <SummaryHeader />

      <SummaryLine label="Subtotal" value={subtotal} />
      <SummaryLine label="Shipping" value={shippingCost} showBorder />

      <CouponSection
        couponCode={couponCode}
        onCouponChange={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <TotalLine total={total} />

      <CheckoutButton
        isAuthenticated={isAuthenticated}
        onCheckout={onCheckout}
      />
    </div>
  );
}

/* -------------------- Subcomponents -------------------- */

/** Header */
function SummaryHeader() {
  return (
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
      Order Summary
    </h2>
  );
}

/** Cost Breakdown Line */
interface SummaryLineProps {
  label: string;
  value: number;
  showBorder?: boolean;
}

function SummaryLine({ label, value, showBorder = false }: SummaryLineProps) {
  return (
    <div
      className={`flex justify-between items-center mb-3 sm:mb-4 ${
        showBorder ? 'pb-4 sm:pb-6 border-b border-gray-200' : ''
      }`}
    >
      <span className="text-sm sm:text-base md:text-lg text-gray-600">{label}</span>
      <span className="text-sm sm:text-base md:text-lg text-gray-900 font-semibold">
        {formatGhs(value)}
      </span>
    </div>
  );
}

/** Coupon Section */
interface CouponSectionProps {
  couponCode: string;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  appliedCoupon: string | null;
}

function CouponSection({
  couponCode,
  onCouponChange,
  onApplyCoupon,
  appliedCoupon,
}: CouponSectionProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="Enter coupon code"
          disabled={!!appliedCoupon}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        />
        <button
          onClick={onApplyCoupon}
          disabled={!couponCode.trim() || !!appliedCoupon}
          className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-100 text-red-500 font-medium rounded-lg hover:bg-red-200 transition-all text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {appliedCoupon ? 'Applied' : 'Apply'}
        </button>
      </div>

      {appliedCoupon && (
        <p className="text-xs sm:text-sm text-green-600 mt-2">
          ✓ Coupon &quot;{appliedCoupon}&quot; applied
        </p>
      )}
    </div>
  );
}

/** Total Line */
function TotalLine({ total }: { total: number }) {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
      <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
        Total
      </span>
      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        {formatGhs(total)}
      </span>
    </div>
  );
}

/** Checkout Button */
interface CheckoutButtonProps {
  isAuthenticated: boolean;
  onCheckout: () => void;
}

function CheckoutButton({ isAuthenticated, onCheckout }: CheckoutButtonProps) {
  return (
    <>
      <button
        onClick={onCheckout}
        className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 rounded-md transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg shadow-sm hover:shadow-sm"
      >
        {!isAuthenticated && '🔒 '}
        Proceed to Checkout
        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
      </button>

      {!isAuthenticated && (
        <p className="text-xs sm:text-xs text-gray-500 text-center mb-3">
          You&apos;ll be asked to sign in before checkout
        </p>
      )}
    </>
  );
}

