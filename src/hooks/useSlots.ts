/**
 * Custom React Hook for Slot Management
 * 
 * Provides a simple, reusable way to manage slots in any component.
 * Handles loading states, errors, and provides convenient methods.
 * 
 * @example
 * function MyComponent() {
 *   const { slots, isLoading, purchaseSlots, refetch } = useSlots(userId);
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return (
 *     <div>
 *       <p>Available: {slots?.availableSlots}</p>
 *       <button onClick={() => purchaseSlots(5)}>Buy 5 Slots</button>
 *     </div>
 *   );
 * }
 */

import { useState, useEffect, useCallback } from 'react';
import { slotService } from '@/services/slotService';
import type { UserSlotsResponse, SlotPurchaseResponse } from '@/types/slots';

interface UseSlots {
  /** Current slot data (null if not loaded) */
  slots: UserSlotsResponse | null;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error message if any */
  error: string | null;
  
  /** Manually refetch slot data */
  refetch: () => Promise<void>;
  
  /** Purchase slots and redirect to Paystack */
  purchaseSlots: (quantity: number) => Promise<SlotPurchaseResponse>;
  
  /** Check if user has available slots */
  hasAvailableSlots: () => boolean;
  
  /** Check if user has enough slots for a specific quantity */
  hasEnoughSlots: (required: number) => boolean;
  
  /** Get total slots (available + used) */
  getTotalSlots: () => number;
  
  /** Get usage percentage */
  getUsagePercentage: () => number;
}

/**
 * Hook for managing user slots
 * 
 * @param userId - The ID of the user
 * @param options - Configuration options
 * @returns Slot management utilities
 */
export function useSlots(
  userId: number,
  options?: {
    /** Auto-refresh interval in milliseconds */
    autoRefresh?: boolean;
    /** Refresh interval (default: 60000ms = 1 minute) */
    refreshInterval?: number;
    /** Callback when slots are successfully fetched */
    onFetch?: (slots: UserSlotsResponse) => void;
    /** Callback when an error occurs */
    onError?: (error: string) => void;
  }
): UseSlots {
  const [slots, setSlots] = useState<UserSlotsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      setError(null);
      const data = await slotService.getUserSlots(userId);
      
      if (data) {
        setSlots(data);
        options?.onFetch?.(data);
      } else {
        const errorMsg = 'Failed to fetch slot information';
        setError(errorMsg);
        options?.onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching slots:', err);
      setError(errorMsg);
      options?.onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [userId, options]);

  useEffect(() => {
    fetchSlots();

    if (options?.autoRefresh) {
      const interval = setInterval(fetchSlots, options.refreshInterval || 60000);
      return () => clearInterval(interval);
    }
  }, [fetchSlots, options?.autoRefresh, options?.refreshInterval]);

  const purchaseSlots = useCallback(async (quantity: number): Promise<SlotPurchaseResponse> => {
    try {
      const result = await slotService.purchaseSlots(userId, quantity);
      
      if (result.success && result.authorization?.authorization_url) {
        // Redirect to Paystack
        window.location.href = result.authorization.authorization_url;
      }
      
      return result;
    } catch (err) {
      console.error('Purchase error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to purchase slots',
      };
    }
  }, [userId]);

  const hasAvailableSlots = useCallback((): boolean => {
    return slots ? slots.availableSlots > 0 : false;
  }, [slots]);

  const hasEnoughSlots = useCallback((required: number): boolean => {
    return slots ? slots.availableSlots >= required : false;
  }, [slots]);

  const getTotalSlots = useCallback((): number => {
    return slots ? slots.availableSlots + slots.usedSlots : 0;
  }, [slots]);

  const getUsagePercentage = useCallback((): number => {
    if (!slots) return 0;
    const total = slots.availableSlots + slots.usedSlots;
    return total > 0 ? (slots.usedSlots / total) * 100 : 0;
  }, [slots]);

  return {
    slots,
    isLoading,
    error,
    refetch: fetchSlots,
    purchaseSlots,
    hasAvailableSlots,
    hasEnoughSlots,
    getTotalSlots,
    getUsagePercentage,
  };
}

// ============================================================================
// Advanced Hook with Purchase Modal State
// ============================================================================

interface UseSlotPurchaseModal extends UseSlots {
  /** Whether the purchase modal is open */
  isModalOpen: boolean;
  
  /** Open the purchase modal */
  openModal: () => void;
  
  /** Close the purchase modal */
  closeModal: () => void;
  
  /** Toggle the purchase modal */
  toggleModal: () => void;
}

/**
 * Hook that includes modal state management
 * 
 * @param userId - The ID of the user
 * @returns Slot management utilities with modal state
 * 
 * @example
 * function MyComponent() {
 *   const { 
 *     slots, 
 *     isModalOpen, 
 *     openModal, 
 *     closeModal 
 *   } = useSlotPurchaseModal(userId);
 *   
 *   return (
 *     <>
 *       <button onClick={openModal}>Buy Slots</button>
 *       
 *       <PurchaseSlotsModal
 *         isOpen={isModalOpen}
 *         onClose={closeModal}
 *         userId={userId}
 *         currentSlots={slots?.availableSlots || 0}
 *       />
 *     </>
 *   );
 * }
 */
export function useSlotPurchaseModal(
  userId: number,
  options?: Parameters<typeof useSlots>[1]
): UseSlotPurchaseModal {
  const slotHook = useSlots(userId, options);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {
    ...slotHook,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
    toggleModal: () => setIsModalOpen(prev => !prev),
  };
}

// ============================================================================
// Hook with Optimistic Updates
// ============================================================================

/**
 * Hook with optimistic updates for better UX
 * Updates UI immediately while waiting for server confirmation
 */
export function useSlotOptimistic(userId: number) {
  const { slots, isLoading, error, refetch } = useSlots(userId);
  const [optimisticSlots, setOptimisticSlots] = useState<number | null>(null);

  // Use optimistic value if available, otherwise use actual value
  const displaySlots = optimisticSlots !== null ? optimisticSlots : slots?.availableSlots || 0;

  const purchaseSlots = async (quantity: number) => {
    // Optimistically update UI
    setOptimisticSlots((prev) => (prev || slots?.availableSlots || 0) + quantity);

    try {
      const result = await slotService.purchaseSlots(userId, quantity);
      
      if (result.success && result.authorization?.authorization_url) {
        window.location.href = result.authorization.authorization_url;
      } else {
        // Revert optimistic update on error
        setOptimisticSlots(null);
        throw new Error(result.error || 'Purchase failed');
      }

      return result;
    } catch (err) {
      // Revert optimistic update
      setOptimisticSlots(null);
      throw err;
    }
  };

  return {
    slots: {
      ...slots,
      availableSlots: displaySlots,
    } as UserSlotsResponse,
    isLoading,
    error,
    refetch,
    purchaseSlots,
  };
}
