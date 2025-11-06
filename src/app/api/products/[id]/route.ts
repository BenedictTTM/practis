import { NextRequest, NextResponse } from 'next/server';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:3001';

type RouteContext = { params: Promise<{ id?: string | string[] }> };

async function resolveProductId(context: RouteContext) {
  const params = await context.params;
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!idParam) {
    throw new Error('Product ID is required');
  }

  return idParam;
}

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    let id: string;
    try {
      id = await resolveProductId(context);
    } catch (err) {
      console.error('[API] Product ID resolution error:', err);
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const backendUrl = `${API_URL}/products/${id}`;
    console.log(`[API] Fetching product from backend: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log(`[API] Backend response status: ${response.status}`);
    const result = await response.json();
    
    if (!response.ok) {
      console.error(`[API] Backend error for product ${id}:`, result);
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to fetch product', data: null },
        { status: response.status }
      );
    }

    console.log(`[API] Product ${id} fetched successfully:`, result.title || 'No title');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] GET Product Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    let id: string;
    try {
      id = await resolveProductId(context);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    const formData = await request.formData();
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': authHeader,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to update product' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT Product API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    let id: string;
    try {
      id = await resolveProductId(context);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to delete product' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE Product API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}