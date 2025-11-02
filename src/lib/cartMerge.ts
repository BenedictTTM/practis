/**
 * Cart Merge Utility
 * 
 * Handles merging anonymous (local storage) cart with authenticated user cart
 * Called after successful login/signup
 * 
 * @module CartMergeUtils
 */

import { mergeCart } from './cart';
import { getLocalCartForMerge, clearLocalCart, getLocalCartItemCount } from './localCart';

/**
 * Merge local cart with server cart after authentication
 * 
 * This should be called immediately after successful login/signup
 * to ensure the user's anonymous cart items are preserved
 * 
 * @returns Promise<boolean> - Success status
 */
export async function mergeAnonymousCart(): Promise<{
  success: boolean;
  message?: string;
  itemCount?: number;
}> {
  try {
    // Check if there are items in local cart
    const itemCount = getLocalCartItemCount();
    
    if (itemCount === 0) {
      console.log('📦 No local cart items to merge');
      return { success: true, itemCount: 0 };
    }

    console.log(`📦 Merging ${itemCount} items from local cart...`);

    // Get local cart items in merge format
    const localItems = getLocalCartForMerge();

    // Call merge API
    const result = await mergeCart(localItems);

    if (result.success) {
      // Clear local storage cart after successful merge
      clearLocalCart();
      console.log('✅ Cart merged successfully and local cart cleared');
      
      return {
        success: true,
        itemCount,
        message: `${itemCount} item${itemCount > 1 ? 's' : ''} added to your cart`,
      };
    } else {
      console.error('❌ Failed to merge cart:', result.message);
      return {
        success: false,
        message: result.message || 'Failed to merge cart',
      };
    }
  } catch (error: any) {
    console.error('💥 Error merging cart:', error);
    return {
      success: false,
      message: error.message || 'Unexpected error during cart merge',
    };
  }
}

/**
 * Check if user has items in local cart
 */
export function hasLocalCartItems(): boolean {
  return getLocalCartItemCount() > 0;
}
