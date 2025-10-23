import { SearchResult, SearchParams, AutocompleteResult } from '@/types/search';

/**
 * Search products with filters
 */
export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const queryParams = new URLSearchParams();

  if (params.q) queryParams.append('q', params.q);
  if (params.category) queryParams.append('category', params.category);
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params.condition) queryParams.append('condition', params.condition);
  if (params.tags) queryParams.append('tags', params.tags);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const response = await fetch(`/api/products/search?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to search products');
  }

  return response.json();
}

/**
 * Get autocomplete suggestions
 */
export async function getAutocompleteSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    `/api/products/search/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to get autocomplete suggestions');
  }

  const data: AutocompleteResult = await response.json();
  return data.suggestions;
}

/**
 * Search products client-side (for use in client components)
 */
export async function searchProductsClient(params: SearchParams): Promise<SearchResult> {
  return searchProducts(params);
}
