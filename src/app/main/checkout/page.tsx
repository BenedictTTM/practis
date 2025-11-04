"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { placeOrder } from "../../../lib/orders";
import type { Product } from "../../../types/products";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL params for product checkout
  const productId = searchParams.get("productId");
  const quantityParam = searchParams.get("quantity");
  
  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [productError, setProductError] = useState<string | null>(null);
  
  // Form state
  const [quantity, setQuantity] = useState<number>(parseInt(quantityParam || "1", 10) || 1);
  const [hall, setHall] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [callNumber, setCallNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  
  // Fetch product details
  useEffect(() => {
    if (!productId) {
      setProductError("No product selected. Please return to products page.");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setLoadingProduct(true);
      setProductError(null);
      
      try {
        const response = await fetch(`/api/products/${productId}`, { signal });
        const body = await response.json().catch(() => null);
        const payload = (body && (body.data ?? body)) ?? null;

        if (!response.ok) {
          const message = payload?.message ?? response.statusText ?? "Failed to fetch product";
          setProductError(`Error: ${message}`);
          setProduct(null);
        } else {
          setProduct(payload as Product);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Product fetch error:", err);
        setProductError("Failed to load product details");
      } finally {
        setLoadingProduct(false);
      }
    })();

    return () => controller.abort();
  }, [productId]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp number is required";
    } else if (!/^\+?[0-9\s()-]{8,}$/.test(whatsapp)) {
      newErrors.whatsapp = "Please enter a valid phone number";
    }

    if (!callNumber.trim()) {
      newErrors.callNumber = "Call number is required";
    } else if (!/^\+?[0-9\s()-]{8,}$/.test(callNumber)) {
      newErrors.callNumber = "Please enter a valid phone number";
    }

    if (quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (product && quantity > (product.stock || 0)) {
      newErrors.quantity = `Only ${product.stock} items available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handleConfirm = async () => {
    if (!productId || !product) {
      alert("Product information is missing");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await placeOrder({
        productId: parseInt(productId, 10),
        quantity,
        whatsappNumber: whatsapp,
        callNumber,
        hall: hall.trim() || undefined,
        message: message.trim() || undefined,
      });

      if (result.success) {
        setOrderSuccess(true);
        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          router.push("/main/orders");
        }, 2000);
      } else {
        setErrors({ submit: result.message || "Failed to place order" });
      }
    } catch (err: any) {
      console.error("Order submission error:", err);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6">
          Loaing
        </div>
      </div>
    );
  }

  // Error state
  if (productError || (!product && !loadingProduct)) {
    const errorMessage = productError || (!productId 
      ? "No product selected. To checkout, click 'Buy Now' on any product page." 
      : "Product not found");
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Product</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/main/products")}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
            {productId && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  // This should never happen because of the checks above, but TypeScript needs assurance
  if (!product) {
    return null;
  }

  const unitPrice = product.discountedPrice ?? product.originalPrice ?? 0;
  const subtotal = unitPrice * quantity;
  const currency = "GHS"; // Default currency

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
          <div className="flex justify-between items-start border rounded-xl px-4 py-3 bg-gray-50">
            <div className="flex-1">
              <p className="text-gray-700 font-medium">{product.title}</p>
              <p className="text-sm text-gray-500 mt-1">Quantity: {quantity}</p>
              {product.stock && product.stock < 10 && (
                <p className="text-xs text-amber-600 mt-1">
                  Only {product.stock} left in stock
                </p>
              )}
            </div>
            <span className="font-semibold text-gray-800">
              {currency} {unitPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="border-t"></div>

        {/* Contact Information */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                placeholder="Hall / Hostel (Optional)"
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.hall ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.hall && <p className="text-red-500 text-xs mt-1">{errors.hall}</p>}
            </div>

            <div>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp Number *"
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.whatsapp ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <input
                type="tel"
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
                placeholder="Call Number *"
                className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.callNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.callNumber && <p className="text-red-500 text-xs mt-1">{errors.callNumber}</p>}
            </div>
          </div>
        </div>

        <div className="border-t"></div>

        {/* Additional Info */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Additional Information</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add any special requests or notes here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4 space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 text-lg pt-2 border-t">
            <span>Total Amount</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-800 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-3">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !product}
            className={`w-full rounded-xl py-3 text-base font-semibold transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Confirm Purchase"
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Product
          </button>
        </div>
      </div>
    </div>
  );
}
