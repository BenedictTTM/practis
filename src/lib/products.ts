import { Product } from '../types/products';

/**
 * Standard API response format
 */
export interface ProductsResponse {
  success: boolean;
  data?: Product[];
  message?: string;
}

/**
 * Single product response format
 */
export interface ProductResponse {
  success: boolean;
  data?: Product;
  message?: string;
}

/**
 * Fetch all products for the authenticated user
 * Requires user to be logged in (uses HTTP-only cookies)
 *
 * @returns Promise<ProductsResponse> - Array of user's products
 * 
 * @example
 * ```typescript
 * const result = await fetchMyProducts();
 * if (result.success) {
 *   console.log('My products:', result.data);
 * }
 * ```
 */
export async function fetchMyProducts(): Promise<ProductsResponse> {
  try {
    console.log('📤 Fetching user products...');
    
    const response = await fetch('/api/products/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
    });

    const data = await response.json();
    console.log('📦 My products result:', {
      status: response.status,
      success: data.success,
      productCount: data.data?.length || 0,
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch user products',
      };
    }

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('💥 Error fetching my products:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Fetch all products (public endpoint)
 * No authentication required
 * 
 * @returns Promise<ProductsResponse> - Array of all active products
 * 
 * @example
 * ```typescript
 * const result = await fetchAllProducts();
 * if (result.success) {
 *   console.log('All products:', result.data);
 * }
 * ```
 */
export async function fetchAllProducts(): Promise<ProductsResponse> {
  try {
    console.log('📤 Fetching all products...');
    
    const response = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('📦 All products result:', {
      status: response.status,
      success: data.success,
      productCount: Array.isArray(data) ? data.length : (data.data?.length || 0),
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch products',
      };
    }

    // Handle different response formats
    const products = Array.isArray(data) ? data : (data.data || []);
    
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error('💥 Error fetching all products:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Fetch a single product by ID
 * 
 * @param productId - The ID of the product to fetch
 * @returns Promise<ProductResponse> - Single product data
 * 
 * @example
 * ```typescript
 * const result = await fetchProductById(123);
 * if (result.success) {
 *   console.log('Product:', result.data);
 * }
 * ```
 */
export async function fetchProductById(productId: number): Promise<ProductResponse> {
  try {
    console.log(`📤 Fetching product ${productId}...`);
    
    const response = await fetch(`/api/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch product',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('💥 Error fetching product:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Search products by query string
 * 
 * @param query - Search term
 * @returns Promise<ProductsResponse> - Array of matching products
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
  try {
    console.log(`📤 Searching products: "${query}"...`);
    
    const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to search products',
      };
    }

    const products = Array.isArray(data) ? data : (data.data || []);
    
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error('💥 Error searching products:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}

/**
 * Fetch products by category
 * 
 * @param category - Category name
 * @returns Promise<ProductsResponse> - Array of products in category
 */
export async function fetchProductsByCategory(category: string): Promise<ProductsResponse> {
  try {
    console.log(`📤 Fetching products in category: "${category}"...`);
    
    const response = await fetch(`/api/products/category/${encodeURIComponent(category)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch products',
      };
    }

    const products = Array.isArray(data) ? data : (data.data || []);
    
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error('💥 Error fetching products by category:', error);
    return {
      success: false,
      message: 'Network error - Unable to connect to server',
    };
  }
}
