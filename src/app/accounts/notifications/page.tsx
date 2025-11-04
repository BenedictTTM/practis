import React from 'react';

type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  productName?: string | null;
  product?: { id: number; title: string; imageUrl: string[] };
};

type Order = {
  id: number;
  createdAt: string;
  updatedAt: string;
  buyerId: number;
  sellerId: number;
  whatsappNumber?: string | null;
  callNumber?: string | null;
  hall?: string | null;
  buyerMessage?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  currency: string;
  totalAmount: number;
  items: OrderItem[];
};

async function fetchSellerOrders(): Promise<Order[]> {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/orders/seller`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!resp.ok) {
    // If unauthorized or error, return empty list; UI will show message
    return [];
  }

  const data = await resp.json();
  // Backend returns array directly; if it wraps, handle both
  return Array.isArray(data) ? data : data?.data || [];
}

export default async function NotificationsPage() {
  const orders = await fetchSellerOrders();

  return (
    <section className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Notifications</h1>
      <p className="text-gray-600 mb-6">Orders placed for your products</p>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          No orders yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()} · {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-base font-semibold">
                    {order.currency} {order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Contact snapshot */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {order.whatsappNumber && (
                  <div>
                    <span className="font-medium">WhatsApp:</span> {order.whatsappNumber}
                  </div>
                )}
                {order.callNumber && (
                  <div>
                    <span className="font-medium">Call:</span> {order.callNumber}
                  </div>
                )}
                {order.hall && (
                  <div>
                    <span className="font-medium">Hall:</span> {order.hall}
                  </div>
                )}
                {order.buyerMessage && (
                  <div className="sm:col-span-2">
                    <span className="font-medium">Message:</span> {order.buyerMessage}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mt-4 border-t pt-4">
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      {item.product?.imageUrl?.[0] ? (
                        <img
                          src={item.product.imageUrl[0]}
                          alt={item.product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-100" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.productName || item.product?.title || `Product #${item.productId}`}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right text-sm">
                        {order.currency} {(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
