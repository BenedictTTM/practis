import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/user/[id]/profile
 * Fetches detailed user profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const { id } = await params;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}/profile`, {
      method: 'GET',
      headers: {
        'Cookie': `access_token=${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/[id]/profile
 * Updates user profile (firstName, lastName, storeName)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const { id } = await params;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, storeName } = body;
    
    if (!firstName || firstName.length < 2 || firstName.length > 50) {
      return NextResponse.json(
        { error: 'First name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (!lastName || lastName.length < 2 || lastName.length > 50) {
      return NextResponse.json(
        { error: 'Last name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    if (storeName && (storeName.length < 2 || storeName.length > 100)) {
      return NextResponse.json(
        { error: 'Store name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
