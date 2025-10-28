/**
 * Slot-related type definitions for the frontend
 */

export interface SlotPurchaseRequest {
  userId: number;
  slots: number;
}

export interface SlotPurchaseResponse {
  success: boolean;
  data?: {
    id: number;
    userId: number;
    amount: number;
    currency: string;
    status: string;
    slotsGranted: number;
    createdAt: string;
  };
  authorization?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  providerReference?: string;
  error?: string;
}

export interface UserSlotsResponse {
  id: number;
  availableSlots: number;
  usedSlots: number;
}

export interface WebhookPayload {
  event: string;
  data: {
    reference: string;
    status: string;
  };
}
