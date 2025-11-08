import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string from all search parameters
    const queryString = searchParams.toString();
    
    console.log('🔍 Frontend API: Searching with query:', queryString);
    
    const response = await fetch(`${BACKEND_URL}/products/search?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for real-time search results
    });

    if (!response.ok) {
      console.error('❌ Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Frontend API: Got response:', {
      total: data.total,
      productsCount: data.products?.length,
      page: data.page,
      hasProducts: Array.isArray(data.products),
      firstProduct: data.products?.[0] ? {
        id: data.products[0].id,
        title: data.products[0].title,
      } : null
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search products',
        products: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
