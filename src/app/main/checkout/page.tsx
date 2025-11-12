"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { placeOrder } from "../../../lib/orders";
import type { Product } from "../../../types/products";
import { CheckoutHeader, CheckoutForm } from "@/Components/Checkout";

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
  const phoneRegex = /^\+?[0-9\s()-]{8,}$/;

  const CheckoutSchema = z.object({
    productId: z
      .number({ required_error: "Product is required" })
      .int()
      .positive(),
    quantity: z
      .number({ required_error: "Quantity is required" })
      .int()
      .min(1, "Quantity must be at least 1"),
    hall: z
      .string()
      .max(120, "Hall/Hostel is too long")
      .optional()
      .or(z.literal("")),
    whatsapp: z
      .string({ required_error: "WhatsApp number is required" })
      .min(1, "WhatsApp number is required")
      .regex(phoneRegex, "Please enter a valid phone number"),
    callNumber: z
      .string({ required_error: "Call number is required" })
      .min(1, "Call number is required")
      .regex(phoneRegex, "Please enter a valid phone number"),
    message: z
      .string()
      .max(500, "Message is too long")
      .optional()
      .or(z.literal("")),
  });

  const validateForm = (): boolean => {
    const pid = productId ? parseInt(productId, 10) : NaN;
    const result = CheckoutSchema.safeParse({
      productId: pid,
      quantity,
      hall,
      whatsapp,
      callNumber,
      message,
    });

    const newErrors: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        // Keep only the first error per field for concise messages
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
    }

    // Stock validation depends on loaded product
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-10 px-3 sm:px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (productError) {
    throw new Error(typeof productError === 'string' ? productError : 'Failed to checkout retry');
  }
  // Success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-10 px-3 sm:px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-5 text-center">
          <div className="text-green-600 mb-3">
            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1.5">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-1.5 text-sm">Your order has been confirmed.</p>
          <p className="text-xs text-gray-500 mb-5">Redirecting to your orders...</p>
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
    <div className="min-h-screen  py-1 sm:py-2 md:py-2 px-2.5 sm:px-4 md:px-6">
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto w-full">
        <CheckoutHeader />
        <CheckoutForm
          product={product}
          quantity={quantity}
          currency={currency}
          unitPrice={unitPrice}
          subtotal={subtotal}
          hall={hall}
          whatsapp={whatsapp}
          callNumber={callNumber}
          message={message}
          errors={errors}
          isSubmitting={isSubmitting || !product}
          onChange={(field, value) => {
            if (field === 'hall') setHall(value);
            else if (field === 'whatsapp') setWhatsapp(value);
            else if (field === 'callNumber') setCallNumber(value);
            else if (field === 'message') setMessage(value);
          }}
          onConfirm={handleConfirm}
          onBack={() => router.back()}
        />
      </div>
    </div>
  );
}
