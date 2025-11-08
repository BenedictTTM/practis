"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchMyOrders } from "../../../../lib/orders";
import { OrderCard, OrderStatusStepper } from "@/Components/Order";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: number;
    title: string;
    imageUrl: string | string[];
  };
}

interface Order {
  id: number;
  buyerId: number;
  sellerId: number;
  whatsappNumber: string;
  callNumber: string;
  hall?: string;
  buyerMessage?: string;
  status: string;
  currency: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMyOrders();
      if ((result as any).status === 401) {
        const target = encodeURIComponent(pathname || "/main/orders/myorders");
        router.push(`/auth/login?redirect=${target}`);
        return;
      }

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.message || "Failed to load orders");
      }
    } catch (err: any) {
      console.error("MyOrders fetch error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = (order: Order) => {
    if (!order.items || order.items.length === 0) return;
    const primary = order.items[0];
    const productId = primary.productId;
    const qty = primary.quantity || 1;
    router.push(`/main/checkout?productId=${productId}&quantity=${qty}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadOrders}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <button
            onClick={() => router.push("/main/products")}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Status stepper */}
        {orders.length > 0 && (
          <OrderStatusStepper current={orders[0]?.status || "PENDING"} />
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => router.push("/main/products")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Proceed to Checkout (uses first order) */}
      {orders.length > 0 && orders[0].items?.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => handleProceedToCheckout(orders[0])}
            className="px-5 sm:px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
