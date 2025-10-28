/**
 * Slot Service - Frontend API for slot management
 * 
 * Handles all slot-related operations including:
 * - Purchasing slots via Paystack
 * - Fetching user slot information
 * - Payment verification
 */

import type { 
  SlotPurchaseRequest, 
  SlotPurchaseResponse, 
  UserSlotsResponse 
} from '@/types/slots';

class SlotService {
  private readonly API_BASE = '/api';

  /**
   * Purchase product slots for a user
   * 
   * This initiates a Paystack payment flow:
   * 1. Creates a payment record in the database
   * 2. Initializes Paystack transaction
   * 3. Returns authorization URL for user redirection
   * 
   * @param userId - The ID of the user purchasing slots
   * @param slots - Number of slots to purchase (1 GHS per slot)
   * @returns Payment initialization data with Paystack redirect URL
   * 
   * @example
   * const result = await slotService.purchaseSlots(1, 5);
   * if (result.success && result.authorization) {
   *   window.location.href = result.authorization.authorization_url;
   * }
   */
  async purchaseSlots(
    userId: number, 
    slots: number
  ): Promise<SlotPurchaseResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/slots/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, slots } as SlotPurchaseRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to purchase slots');
      }

      return data;
    } catch (error) {
      console.error('SlotService.purchaseSlots error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get slot information for a user
   * 
   * Returns the current slot balance:
   * - availableSlots: Slots that can be used to list products
   * - usedSlots: Slots currently in use by active listings
   * 
   * @param userId - The ID of the user
   * @returns User's slot information
   * 
   * @example
   * const slots = await slotService.getUserSlots(1);
   * console.log(`Available: ${slots.availableSlots}, Used: ${slots.usedSlots}`);
   */
  async getUserSlots(userId: number): Promise<UserSlotsResponse | null> {
    try {
      const response = await fetch(`${this.API_BASE}/slots/${userId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to fetch user slots:', response.status);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SlotService.getUserSlots error:', error);
      return null;
    }
  }

  /**
   * Verify payment callback from Paystack
   * 
   * After user completes payment on Paystack, they're redirected back with a reference.
   * This method extracts the reference from the URL for further processing.
   * 
   * Note: The actual webhook handler runs server-side to credit slots.
   * This is just for client-side verification and UI updates.
   * 
   * @param callbackUrl - The full callback URL from Paystack redirect
   * @returns The payment reference if found
   * 
   * @example
   * // User redirected to: https://yoursite.com/payment-success?reference=payment-22-123456
   * const reference = slotService.extractPaymentReference(window.location.href);
   */
  extractPaymentReference(callbackUrl: string): string | null {
    try {
      const url = new URL(callbackUrl);
      return url.searchParams.get('reference');
    } catch (error) {
      console.error('Failed to extract payment reference:', error);
      return null;
    }
  }

  /**
   * Calculate the total cost for purchasing slots
   * 
   * @param slots - Number of slots
   * @param pricePerSlot - Price per slot in GHS (default: 1)
   * @returns Total cost in GHS
   */
  calculateCost(slots: number, pricePerSlot: number = 1): number {
    return slots * pricePerSlot;
  }
}

// Export singleton instance
export const slotService = new SlotService();
export default slotService;
