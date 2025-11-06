"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";

export interface OrderItemUI {
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

export interface OrderUI {
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
  items: OrderItemUI[];
}

interface Props {
  order: OrderUI;
  onProceed?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProductImage(item: OrderItemUI): string {
  if (item.product?.imageUrl) {
    if (Array.isArray(item.product.imageUrl)) {
      return item.product.imageUrl[0] || "/placeholder.png";
    }
    return item.product.imageUrl;
  }
  return "/placeholder.png";
}

function StatusPill({ status }: { status: string }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border";
  const cls = {
    PENDING: "bg-red-50 text-red-600 border-red-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  } as Record<string, string>;
  const key = (status || "").toUpperCase();
  return <span className={`${base} ${cls[key] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{status}</span>;
}

export function OrderCard({ order, onProceed }: Props) {
  const primaryItem = order.items?.[0];
  const unitPrice = primaryItem?.unitPrice ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b">
        <div>
          <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Item row */}
      {primaryItem && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={getProductImage(primaryItem)}
                alt={primaryItem.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-semibold truncate">
                {primaryItem.productName}
              </p>
              <p className="text-sm text-gray-500 mt-1">Quantity: {primaryItem.quantity}</p>
              <p className="text-sm text-gray-700 mt-1">
                {order.currency} {unitPrice.toFixed(2)}
              </p>
            </div>
          </div>
          {order.buyerMessage && (
            <div className="sm:w-72">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Customer Note:</p>
                <p className="text-sm text-gray-700 leading-relaxed break-words">
                  {order.buyerMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contacts */}
      <div className="flex items-center gap-6 text-sm text-gray-700 pl-20 sm:pl-20">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>Call</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>WhatsApp</span>
        </div>
      </div>

      <div className="my-4 h-px bg-gray-200" />

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm text-gray-500">Total Amount:</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900">
          {order.currency} {order.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default OrderCard;
