"use client";

import { useState, useEffect } from "react";
import OrdersLoading from './loading';
import { useRouter, usePathname } from "next/navigation";
import { fetchMyOrders } from "../../../lib/orders";
import NoOrders from '../../../Components/Order/NoOder';
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
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
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

  // Render the route-level loading UI while fetching orders
  if (loading) {
    return <OrdersLoading />;
  }

  if (error) {
    throw new Error(typeof error === 'string' ? error : 'Failed to load orders');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 md:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={() => router.push("/main/products")}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <NoOrders />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden w-full sm:max-w-2xl sm:mx-auto">
                {/* Order Header */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 px-4 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3">
                  <div className="flex-1">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">Order #{order.id}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <span className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-5 pb-2 sm:pb-3 border-b border-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 sm:gap-3 py-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <h3 className="font-medium text-gray-900 text-xs sm:text-sm truncate">{item.productName}</h3>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                          {order.currency}{item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact Information */}
                <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Contact Information</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex flex-col xs:flex-row xs:gap-2">
                      <span className="text-gray-600 xs:w-20 sm:w-24 font-medium xs:font-normal">WhatsApp</span>
                      <span className="text-gray-900 break-all">{order.whatsappNumber}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:gap-2">
                      <span className="text-gray-600 xs:w-20 sm:w-24 font-medium xs:font-normal">Call</span>
                      <span className="text-gray-900 break-all">{order.callNumber}</span>
                    </div>
                    {order.hall && (
                      <div className="flex flex-col xs:flex-row xs:gap-2">
                        <span className="text-gray-600 xs:w-20 sm:w-24 font-medium xs:font-normal">Hall/Hostel</span>
                        <span className="text-gray-900">{order.hall}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Note */}
                {order.buyerMessage && (
                  <div className="px-4 sm:px-5 py-3 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1.5">Note</h4>
                    <p className="text-xs sm:text-sm text-gray-700 leading-snug break-words">{order.buyerMessage}</p>
                  </div>
                )}

                {/* Total Amount */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">Total Amount</span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {order.currency}{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
