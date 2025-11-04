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

// Simple client-side guard to prevent duplicate/concurrent merges
let mergeInProgress = false;
const MERGE_DONE_KEY = 'sellr_cart_merge_done';

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
    // Prevent duplicate/concurrent merges in the same session
    if (mergeInProgress) {
      console.warn('🟡 Cart merge already in progress, skipping duplicate call');
      return { success: true, message: 'Merge already in progress, skipped' };
    }

    // If already merged during this session, skip
    if (typeof window !== 'undefined') {
      const alreadyMerged = sessionStorage.getItem(MERGE_DONE_KEY) === '1';
      if (alreadyMerged) {
        console.log('🟢 Cart merge previously completed this session, skipping');
        return { success: true, message: 'Cart already merged' };
      }
    }

    // Check if there are items in local cart
    const itemCount = getLocalCartItemCount();
    
    if (itemCount === 0) {
      console.log('📦 No local cart items to merge');
      return { success: true, itemCount: 0 };
    }

    console.log(`📦 Merging ${itemCount} items from local cart...`);

    // Get local cart items in merge format
    const localItems = getLocalCartForMerge();

    // Mark as in-progress
    mergeInProgress = true;

    // Call merge API
    const result = await mergeCart(localItems);

    if (result.success) {
      // Clear local storage cart after successful merge
      clearLocalCart();
      console.log('✅ Cart merged successfully and local cart cleared');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(MERGE_DONE_KEY, '1');
      }
      
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
  } finally {
    mergeInProgress = false;
  }
}

/**
 * Check if user has items in local cart
 */
export function hasLocalCartItems(): boolean {
  return getLocalCartItemCount() > 0;
}
