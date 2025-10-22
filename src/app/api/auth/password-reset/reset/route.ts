import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/auth/password-reset/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await backendResponse.text();
    const payload = text.trim() ? JSON.parse(text) : {};

    return NextResponse.json(payload, { status: backendResponse.status });
  } catch (error) {
    console.error('💥 [PROXY] Password reset failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to reset password at this time',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
