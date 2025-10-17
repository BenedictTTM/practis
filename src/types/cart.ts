import { Product } from './products';

/**
 * Cart item with product details and quantity
 */
export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  itemTotal: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Shopping cart with all items and calculated totals
 */
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response for cart operations
 */
export interface CartResponse {
  success: boolean;
  data?: Cart | null;
  message?: string;
}

/**
 * API response for cart item count
 */
export interface CartCountResponse {
  success: boolean;
  count?: number;
  message?: string;
}

/**
 * Add to cart request payload
 */
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * Update cart item request payload
 */
export interface UpdateCartItemRequest {
  quantity: number;
}
