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
 * IMPORTANT - Stock Management Philosophy:
 * ==========================================
 * Cart operations (add, update, merge) do NOT enforce stock limits.
 * Stock is only validated and decremented during checkout/order placement.
 * 
 * Rationale:
 * - High cart abandonment rate (~80%) - shouldn't lock stock
 * - Better UX - users can add items and adjust during shopping
 * - Race conditions - multiple users can browse same products
 * - Stock reservation happens at payment, not browsing
 * 
 * Frontend Responsibilities:
 * - Display stock warnings if quantity > available stock
 * - Show helpful messages: "Only X left in stock"
 * - Disable checkout button if hasStockIssues flag is true
 * - Re-validate cart before proceeding to payment
 * 
 * Backend Guarantees:
 * - Cart operations always succeed (product exists)
 * - Returns stock status with every cart response
 * - Hard stock validation at order creation
 * - Transaction safety for order placement
 * 
 * @module CartService
 * @since 1.0.0
 */

/**
 * Add a product to the user's cart
 * 
 * IMPORTANT: Does NOT validate stock availability.
 * Backend allows any quantity - stock validation happens at checkout.
 * 
 * Creates cart if user doesn't have one.
 * Updates quantity if product already in cart.
 * Requires authentication (HTTP-only cookies).
 * 
 * Response includes stock status for each item:
 * - stockStatus.available: Current stock level
 * - stockStatus.inStock: true if quantity <= available
 * - stockStatus.exceedsStock: true if quantity > available
 * 
 * Frontend should:
 * - Always allow add to cart (optimistic UX)
 * - Display stock warnings if item.product.stockStatus.exceedsStock
 * - Validate before checkout using cart.hasStockIssues flag
 * 
 * @param productId - ID of the product to add
 * @param quantity - Number of items to add (default: 1)
 * @param options - Optional idempotency key for duplicate request protection
 * @returns Promise<CartResponse> - Updated cart with stock status
 * 
 * @example
 * ```typescript
 * const result = await addToCart(5, 2);
 * if (result.success) {
 *   console.log('Cart updated:', result.data);
 *   // Check stock warnings
 *   result.data.items.forEach(item => {
 *     if (item.product.stockStatus.exceedsStock) {
 *       showWarning(`Only ${item.product.stockStatus.available} available`);
 *     }
 *   });
 * } else {
 *   console.error('Error:', result.message);
 * }
 * ```
 */
export async function addToCart(
  productId: number,
  quantity: number = 1,
  options?: { idempotencyKey?: string }
): Promise<CartResponse> {
  try {
    console.log(`🛒 Adding to cart: Product ${productId}, Quantity ${quantity}`);

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}),
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
 * IMPORTANT: Does NOT enforce stock limits.
 * Backend allows any positive quantity - validation at checkout.
 * 
 * Setting quantity to 0 removes the item from cart.
 * Returns updated cart with stock status for all items.
 * Requires authentication.
 * 
 * Frontend should:
 * - Allow users to set any quantity via UI
 * - Show stock warnings if exceeds available
 * - Prevent checkout if cart.hasStockIssues is true
 * 
 * @param itemId - Cart item ID to update
 * @param quantity - New quantity (0 to remove, >0 to update)
 * @returns Promise<CartResponse> - Updated cart with stock status
 * 
 * @example
 * ```typescript
 * const result = await updateCartItem(5, 3);
 * if (result.success) {
 *   console.log('Quantity updated:', result.data);
 *   if (result.data.hasStockIssues) {
 *     console.warn('Some items exceed available stock');
 *   }
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
 * IMPORTANT: Does NOT enforce stock limits during merge.
 * Backend merges all items - stock validation deferred to checkout.
 * 
 * Called after user logs in to merge their local cart items
 * with their existing server-side cart.
 * 
 * Merge behavior:
 * - Duplicate products: quantities are added together
 * - New products: added to cart
 * - No stock blocking: merge always succeeds if products exist
 * 
 * Response includes:
 * - hasStockIssues: true if any merged item exceeds stock
 * - Per-item stock status for UI warnings
 * 
 * Frontend workflow:
 * 1. User logs in
 * 2. Get local cart items
 * 3. Call mergeCart(items)
 * 4. Clear local storage on success
 * 5. Show stock warnings if applicable
 * 6. Redirect to cart page for review
 * 
 * @param items - Array of {productId, quantity} from local storage
 * @returns Promise<CartResponse> - Merged cart with stock status
 * 
 * @example
 * ```typescript
 * const localItems = getLocalCartForMerge();
 * const result = await mergeCart(localItems);
 * if (result.success) {
 *   clearLocalCart(); // Clear local storage
 *   if (result.data.hasStockIssues) {
 *     showNotification('Some items in your cart have limited stock');
 *   }
 *   router.push('/cart'); // Review merged cart
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
