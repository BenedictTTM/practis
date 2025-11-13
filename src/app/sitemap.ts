/**
 * Dynamic Sitemap Generation for myPlug
 * Implements Next.js 15 App Router sitemap functionality
 * 
 * Features:
 * - Dynamic product URLs
 * - Category pages
 * - Store pages
 * - Static pages
 * - Proper priority and update frequency
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://myplug.shop';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Fetch all active products for sitemap
 */
async function getProducts() {
  try {
    const response = await fetch(`${BACKEND_URL}/products?limit=1000&isActive=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[Sitemap] Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch all users for store pages
 */
async function getStores() {
  try {
    const response = await fetch(`${BACKEND_URL}/users?limit=500`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('[Sitemap] Error fetching stores:', error);
    return [];
  }
}

/**
 * Generate sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  
  // Static pages (high priority)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/main/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/main/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/main/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Category pages (high priority)
  const categories = [
    'clothes',
    'accessories',
    'home',
    'books',
    'sports_and_outing',
    'others',
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Product pages (dynamic, medium-high priority)
  const products = await getProducts();
  const productPages: MetadataRoute.Sitemap = products.slice(0, 500).map((product: any) => ({
    url: `${SITE_URL}/main/products/${product.id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Store pages (dynamic, medium priority)
  const stores = await getStores();
  const storePages: MetadataRoute.Sitemap = stores
    .filter((user: any) => user.username)
    .slice(0, 200)
    .map((user: any) => ({
      url: `${SITE_URL}/store/${user.username}`,
      lastModified: user.updatedAt ? new Date(user.updatedAt) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Combine all pages
  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...storePages,
  ];
}
