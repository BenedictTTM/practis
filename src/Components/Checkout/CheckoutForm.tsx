'use client';

import type { Product } from '@/types/products';

interface CheckoutFormProps {
  product: Product;
  quantity: number;
  currency: string;
  unitPrice: number;
  subtotal: number;
  hall: string;
  whatsapp: string;
  callNumber: string;
  message: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChange: (field: 'hall' | 'whatsapp' | 'callNumber' | 'message', value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function CheckoutForm({
  product,
  quantity,
  currency,
  unitPrice,
  subtotal,
  hall,
  whatsapp,
  callNumber,
  message,
  errors,
  isSubmitting,
  onChange,
  onConfirm,
  onBack,
}: CheckoutFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6 space-y-4 md:space-y-5">
      {/* Order Summary */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Order Summary</h2>
        <div className="flex justify-between items-start border border-gray-100 rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gray-50">
          <div className="flex-1">
            <p className="text-gray-700 font-medium text-[13px] sm:text-sm md:text-base">{product.title}</p>
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-1">Quantity: {quantity}</p>
            {product.stock && product.stock < 10 && (
              <p className="text-[10px] sm:text-[11px] md:text-xs text-red-600 mt-1">Only {product.stock} left in stock</p>
            )}
          </div>
          <span className="font-semibold text-gray-800 text-sm sm:text-base">
            {currency} {unitPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-t"></div>

      {/* Contact Information */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Contact Information</h2>
        <div className="space-y-2.5">
          <div>
            <input
              type="text"
              value={hall}
              onChange={(e) => onChange('hall', e.target.value)}
              placeholder="Hall / Hostel (Optional)"
              className={`w-full px-2.5 py-2 sm:py-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.hall ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.hall && <p className="text-red-500 text-xs mt-1">{errors.hall}</p>}
          </div>

          <div>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => onChange('whatsapp', e.target.value)}
              placeholder="WhatsApp Number *"
              className={`w-full px-2.5 py-2 sm:py-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
          </div>

          <div>
            <input
              type="tel"
              value={callNumber}
              onChange={(e) => onChange('callNumber', e.target.value)}
              placeholder="Call Number *"
              className={`w-full px-2.5 py-2 sm:py-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.callNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.callNumber && <p className="text-red-500 text-xs mt-1">{errors.callNumber}</p>}
          </div>
        </div>
      </div>

      <div className="border-t"></div>

      {/* Additional Info */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Additional Information</h2>
        <textarea
          value={message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder="Add any special requests or notes here..."
          rows={3}
          className="w-full px-2.5 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Price Summary */}
      <div className="border-t pt-2.5 md:pt-3 space-y-1.5 text-gray-700 text-sm">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>
            {currency} {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 text-base sm:text-lg pt-2 border-t">
          <span>Total Amount</span>
          <span>
            {currency} {subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <p className="text-red-800 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2 md:pt-2.5">
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`w-full rounded-lg py-2 text-sm sm:text-base font-semibold transition-colors ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Purchase'
          )}
        </button>
        <button onClick={onBack} className="w-full text-[11px] sm:text-xs md:text-sm text-gray-500 hover:text-gray-700">
          Back to Product
        </button>
      </div>
    </div>
  );
}
