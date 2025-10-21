import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    // Treat username param as userId
    const userId = username;

    console.log('🔍 Fetching store for user ID:', userId);

    // Fetch user by ID from backend
    const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!userResponse.ok) {
      console.error('❌ User not found with ID:', userId);
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const owner = await userResponse.json();
    console.log('✅ Found store owner:', owner.id, owner.firstName, owner.lastName);

    // Fetch products for this user
    const productsResponse = await fetch(`${API_BASE_URL}/products/user/${owner.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    let products = [];
    if (productsResponse.ok) {
      products = await productsResponse.json();
      console.log('✅ Found products:', products.length);
    } else {
      console.log('⚠️ No products found or error fetching products');
    }

    return NextResponse.json({
      owner,
      products,
    });
  } catch (error) {
    console.error('💥 Error fetching store data:', error);
    return NextResponse.json(
      { error: 'Failed to load store' },
      { status: 500 }
    );
  }
}
