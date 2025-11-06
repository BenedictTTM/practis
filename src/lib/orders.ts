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

// Enhanced: auto-refresh access token on 401 and include status in response
export async function fetchMyOrders() {
  try {
    // Use token refresh interceptor for robust auth
    const { fetchWithTokenRefresh } = await import('./token-refresh');

    const res = await fetchWithTokenRefresh('/api/orders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    // Try to parse JSON body safely
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data?.message || (res.status === 401 ? 'Unauthorized - Please log in' : 'Failed to fetch orders'),
      } as const;
    }

    return { success: true, data: data.data } as const;
  } catch (e) {
    console.error('fetchMyOrders error:', e);
    return { success: false, status: 0, message: 'Network error - Unable to connect to server' } as const;
  }
}
