"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchMyOrders } from "../../../lib/orders";

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

export default function OrdersPage() {
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
        // Not authenticated → redirect to login preserving target route
        const target = encodeURIComponent(pathname || "/main/orders");
        router.push(`/auth/login?redirect=${target}`);
        return;
      }

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.message || "Failed to load orders");
      }
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProductImage = (item: OrderItem): string => {
    if (item.product?.imageUrl) {
      if (Array.isArray(item.product.imageUrl)) {
        return item.product.imageUrl[0] || "/placeholder.png";
      }
      return item.product.imageUrl;
    }
    return "/placeholder.png";
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => router.push("/main/products")}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

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
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage(item)}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {order.currency} {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">WhatsApp:</p>
                      <p className="text-gray-800">{order.whatsappNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Call:</p>
                      <p className="text-gray-800">{order.callNumber}</p>
                    </div>
                    {order.hall && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Hall/Hostel:</p>
                        <p className="text-gray-800">{order.hall}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                {order.buyerMessage && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Your Note:</p>
                    <p className="text-sm text-gray-700">{order.buyerMessage}</p>
                  </div>
                )}

                {/* Total */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-between items-stretch sm:items-center pt-4 border-t">
                  <span className="font-semibold text-gray-700">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </span>
                  {order.items?.length > 0 && (
                    <button
                      onClick={() => handleProceedToCheckout(order)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                      aria-label="Proceed to Checkout"
                    >
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
