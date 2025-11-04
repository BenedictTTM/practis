export interface PlaceOrderInput {
  productId: number;
  quantity: number;
  whatsappNumber: string;
  callNumber: string;
  hall?: string;
  message?: string;
}

export async function placeOrder(input: PlaceOrderInput) {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to place order' };
    }
    return { success: true, data: data.data };
  } catch (e) {
    console.error('placeOrder error:', e);
    return { success: false, message: 'Network error - Unable to connect to server' };
  }
}

export async function fetchMyOrders() {
  try {
    const res = await fetch('/api/orders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Failed to fetch orders' };
    }
    return { success: true, data: data.data };
  } catch (e) {
    console.error('fetchMyOrders error:', e);
    return { success: false, message: 'Network error - Unable to connect to server' };
  }
}
