import {
  Cart,
  CartResponse,
  CartCountResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '../types/cart';

/**
 * Cart Service Layer
 * 
 * Centralized service for all cart-related API operations.
 * Handles authentication, error handling, and response formatting.
 * 
 * @module CartService
 * @since 1.0.0
 */

/**
 * Add a product to the user's cart
 * 
 * Creates cart if user doesn't have one.
 * Updates quantity if product already in cart.
 * Requires authentication (HTTP-only cookies).
 * 
 * @param productId - ID of the product to add
 * @param quantity - Number of items to add (default: 1)
 * @returns Promise<CartResponse> - Updated cart data
 * 
 * @example
 * ```typescript
 * const result = await addToCart(5, 2);
 * if (result.success) {
 *   console.log('Cart updated:', result.data);
 * } else {
 *   console.error('Error:', result.message);
 * }
 * ```
 */
export async function addToCart(
  productId: number,
  quantity: number = 1
): Promise<CartResponse> {
  try {
    console.log(`🛒 Adding to cart: Product ${productId}, Quantity ${quantity}`);

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies for authentication
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Add to cart failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to add item to cart',
        statusCode: response.status, // Include HTTP status code
      };
    }

    console.log('✅ Item added to cart successfully');
    return {
      success: true,
      data: data,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('💥 Network error adding to cart:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
      statusCode: 0, // 0 indicates network error
    };
  }
}

/**
 * Fetch the authenticated user's cart
 * 
 * Returns cart with all items, product details, and calculated totals.
 * Returns null if user has no cart.
 * Requires authentication.
 * 
 * @returns Promise<CartResponse> - Cart data or null
 * 
 * @example
 * ```typescript
 * const result = await fetchCart();
 * if (result.success && result.data) {
 *   console.log('Cart items:', result.data.items);
 *   console.log('Subtotal:', result.data.subtotal);
 * }
 * ```
 */
export async function fetchCart(): Promise<CartResponse> {
  try {
    console.log('🛒 Fetching cart...');

    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Fetch cart failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to fetch cart',
      };
    }

    console.log('✅ Cart fetched:', {
      itemCount: data?.items?.length || 0,
      subtotal: data?.subtotal || 0,
    });

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('💥 Network error fetching cart:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Get the total count of items in the cart
 * 
 * Lightweight endpoint for header badge display.
 * Returns 0 if no cart exists.
 * Requires authentication.
 * 
 * @returns Promise<CartCountResponse> - Item count
 * 
 * @example
 * ```typescript
 * const result = await getCartItemCount();
 * if (result.success) {
 *   console.log('Items in cart:', result.count);
 * }
 * ```
 */
export async function getCartItemCount(): Promise<CartCountResponse> {
  try {
    console.log('🛒 Fetching cart item count...');

    const response = await fetch('/api/cart/count', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch cart count',
      };
    }

    return {
      success: true,
      count: data.count || 0,
    };
  } catch (error) {
    console.error('💥 Network error fetching cart count:', error);
    return {
      success: false,
      count: 0,
      message: 'Network error',
    };
  }
}

/**
 * Update the quantity of a cart item
 * 
 * Validates stock availability on backend.
 * Returns updated cart with new totals.
 * Requires authentication.
 * 
 * @param itemId - Cart item ID to update
 * @param quantity - New quantity (must be >= 1)
 * @returns Promise<CartResponse> - Updated cart data
 * 
 * @example
 * ```typescript
 * const result = await updateCartItem(5, 3);
 * if (result.success) {
 *   console.log('Quantity updated:', result.data);
 * }
 * ```
 */
export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<CartResponse> {
  try {
    console.log(`🛒 Updating cart item ${itemId} to quantity ${quantity}`);

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Update cart item failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to update cart item',
      };
    }

    console.log('✅ Cart item updated successfully');
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('💥 Network error updating cart item:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Remove an item from the cart
 * 
 * Permanently deletes the cart item.
 * Returns updated cart after removal.
 * Requires authentication.
 * 
 * @param itemId - Cart item ID to remove
 * @returns Promise<CartResponse> - Updated cart data
 * 
 * @example
 * ```typescript
 * const result = await removeCartItem(5);
 * if (result.success) {
 *   console.log('Item removed');
 * }
 * ```
 */
export async function removeCartItem(itemId: number): Promise<CartResponse> {
  try {
    console.log(`🛒 Removing cart item ${itemId}`);

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Remove cart item failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to remove cart item',
      };
    }

    console.log('✅ Cart item removed successfully');
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('💥 Network error removing cart item:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Clear all items from the cart
 * 
 * Removes all items but keeps cart entity.
 * Useful for post-checkout cleanup.
 * Requires authentication.
 * 
 * @returns Promise<CartResponse> - Empty cart data
 * 
 * @example
 * ```typescript
 * const result = await clearCart();
 * if (result.success) {
 *   console.log('Cart cleared');
 * }
 * ```
 */
export async function clearCart(): Promise<CartResponse> {
  try {
    console.log('🛒 Clearing cart...');

    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Clear cart failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to clear cart',
      };
    }

    console.log('✅ Cart cleared successfully');
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('💥 Network error clearing cart:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Merge anonymous cart with authenticated user's cart
 * 
 * Called after user logs in to merge their local cart items
 * with their existing server-side cart.
 * 
 * @param items - Array of {productId, quantity} from local storage
 * @returns Promise<CartResponse> - Merged cart data
 * 
 * @example
 * ```typescript
 * const localItems = getLocalCartForMerge();
 * const result = await mergeCart(localItems);
 * if (result.success) {
 *   clearLocalCart(); // Clear local storage after successful merge
 * }
 * ```
 */
export async function mergeCart(
  items: Array<{ productId: number; quantity: number }>
): Promise<CartResponse> {
  try {
    console.log('🔄 Merging anonymous cart with user cart:', {
      itemCount: items.length,
    });

    const response = await fetch('/api/cart/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Cart merge failed:', data.message);
      return {
        success: false,
        message: data.message || 'Failed to merge cart',
        statusCode: response.status,
      };
    }

    console.log('✅ Cart merged successfully');
    return {
      success: true,
      data: data,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('💥 Network error merging cart:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
      statusCode: 0,
    };
  }
}
