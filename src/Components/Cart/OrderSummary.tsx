'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatGhs } from '@/utilities/formatGhs';

/**
 * OrderSummary Component
 * 
 * Single Responsibility: Calculate and display order totals, handle checkout
 * Open/Closed: Extensible via props (shipping calculation, tax, discounts)
 * Liskov Substitution: Can be replaced with any summary component
 * Interface Segregation: Minimal required props
 * Dependency Inversion: Depends on callback abstraction
 * 
 * @component
 * @example
 * ```tsx
 * <OrderSummary
 *   subtotal={150.00}
 *   isAuthenticated={true}
 *   onCheckout={() => router.push('/checkout')}
 * />
 * ```
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

  // Shipping calculation logic (can be extracted to a service later)
  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // TODO: Call API to validate and apply coupon
      setAppliedCoupon(couponCode);
      console.log('Applying coupon:', couponCode);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 ${className}`}>
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
      
      <ContinueShoppingLink />
    </div>
  );
}

/**
 * SummaryHeader - Atomic component for summary title
 */
function SummaryHeader() {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
      Order Summary
    </h2>
  );
}

/**
 * SummaryLine - Reusable component for cost breakdown rows
 */
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
      <span className="text-sm sm:text-base text-gray-600">{label}</span>
      <span className="text-sm sm:text-base text-gray-900 font-semibold">
        {formatGhs(value)}
      </span>
    </div>
  );
}

/**
 * CouponSection - Component handling coupon code input and application
 */
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
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="Enter coupon code"
          disabled={!!appliedCoupon}
          className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={onApplyCoupon}
          disabled={!couponCode.trim() || !!appliedCoupon}
          className="px-4 sm:px-6 py-2 bg-red-100 text-red-500 font-medium rounded-lg hover:bg-red-200 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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

/**
 * TotalLine - Component displaying final order total
 */
function TotalLine({ total }: { total: number }) {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
      <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
      <span className="text-xl sm:text-2xl font-bold text-gray-900">
        {formatGhs(total)}
      </span>
    </div>
  );
}

/**
 * CheckoutButton - Component handling checkout action
 */
interface CheckoutButtonProps {
  isAuthenticated: boolean;
  onCheckout: () => void;
}

function CheckoutButton({ isAuthenticated, onCheckout }: CheckoutButtonProps) {
  return (
    <>
      <button
        onClick={onCheckout}
        className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base shadow-sm hover:shadow-md"
      >
        {!isAuthenticated && '🔒 '}
        Proceed to Checkout
        <ArrowRight size={18} className="sm:w-5 sm:h-5" />
      </button>

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 text-center mb-3">
          You&apos;ll be asked to sign in before checkout
        </p>
      )}
    </>
  );
}

/**
 * ContinueShoppingLink - Component providing link back to products
 */
function ContinueShoppingLink() {
  return (
    <Link
      href="/main/products"
      className="block text-center text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      Continue Shopping
    </Link>
  );
}
