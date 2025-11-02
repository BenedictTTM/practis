/**
 * Local Storage Cart Management
 * 
 * Handles cart persistence for anonymous (unauthenticated) users.
 * Uses localStorage for client-side cart storage before user logs in.
 * 
 * @module LocalCartService
 * @since 1.0.0
 */

import { Cart, CartItem } from '@/types/cart';
import { Product } from '@/types/products';

const CART_STORAGE_KEY = 'sellr_anonymous_cart';
const CART_VERSION = '1.0'; // For future migrations

export interface LocalCartItem {
  productId: number;
  quantity: number;
  product: Product; // Store full product details
  addedAt: string;
}

export interface LocalCart {
  version: string;
  items: LocalCartItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Initialize or get existing local cart from localStorage
 */
function getLocalCart(): LocalCart {
  if (typeof window === 'undefined') {
    // SSR safety
    return createEmptyCart();
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return createEmptyCart();
    }

    const cart: LocalCart = JSON.parse(stored);
    
    // Validate cart structure
    if (!cart.items || !Array.isArray(cart.items)) {
      console.warn('⚠️ Invalid cart structure, resetting...');
      return createEmptyCart();
    }

    return cart;
  } catch (error) {
    console.error('❌ Error reading local cart:', error);
    return createEmptyCart();
  }
}

/**
 * Save cart to localStorage
 */
function saveLocalCart(cart: LocalCart): void {
  if (typeof window === 'undefined') return;

  try {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log('✅ Local cart saved:', {
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('❌ Error saving local cart:', error);
  }
}

/**
 * Create a new empty cart
 */
function createEmptyCart(): LocalCart {
  return {
    version: CART_VERSION,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Add a product to the local cart
 */
export function addToLocalCart(product: Product, quantity: number = 1): LocalCart {
  const cart = getLocalCart();
  
  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.productId === product.id
  );

  if (existingItemIndex > -1) {
    // Update quantity of existing item
    cart.items[existingItemIndex].quantity += quantity;
    console.log(`📦 Updated quantity for product ${product.id}`);
  } else {
    // Add new item
    cart.items.push({
      productId: product.id,
      quantity,
      product,
      addedAt: new Date().toISOString(),
    });
    console.log(`📦 Added new product ${product.id} to local cart`);
  }

  saveLocalCart(cart);
  return cart;
}

/**
 * Update quantity of a cart item
 */
export function updateLocalCartItem(productId: number, quantity: number): LocalCart {
  const cart = getLocalCart();
  
  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
      console.log(`🗑️ Removed product ${productId} from local cart`);
    } else {
      cart.items[itemIndex].quantity = quantity;
      console.log(`✏️ Updated product ${productId} quantity to ${quantity}`);
    }
    saveLocalCart(cart);
  }

  return cart;
}

/**
 * Remove an item from the local cart
 */
export function removeFromLocalCart(productId: number): LocalCart {
  const cart = getLocalCart();
  
  cart.items = cart.items.filter(item => item.productId !== productId);
  console.log(`🗑️ Removed product ${productId} from local cart`);
  
  saveLocalCart(cart);
  return cart;
}

/**
 * Clear all items from the local cart
 */
export function clearLocalCart(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CART_STORAGE_KEY);
  console.log('🧹 Local cart cleared');
}

/**
 * Get the current local cart
 */
export function getLocalCartData(): LocalCart {
  return getLocalCart();
}

/**
 * Get item count in local cart
 */
export function getLocalCartItemCount(): number {
  const cart = getLocalCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculate subtotal for local cart
 */
export function calculateLocalCartSubtotal(): number {
  const cart = getLocalCart();
  return cart.items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.originalPrice || 0;
    return sum + (price * item.quantity);
  }, 0);
}

/**
 * Check if a product exists in the local cart
 */
export function isProductInLocalCart(productId: number): boolean {
  const cart = getLocalCart();
  return cart.items.some(item => item.productId === productId);
}

/**
 * Get quantity of a specific product in local cart
 */
export function getLocalCartProductQuantity(productId: number): number {
  const cart = getLocalCart();
  const item = cart.items.find(item => item.productId === productId);
  return item?.quantity || 0;
}

/**
 * Convert local cart to format compatible with server cart
 * Used for merging anonymous cart with user cart after login
 */
export function getLocalCartForMerge(): Array<{ productId: number; quantity: number }> {
  const cart = getLocalCart();
  return cart.items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}
