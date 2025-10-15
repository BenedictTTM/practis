import { NextRequest, NextResponse } from 'next/server';

function mask(v?: string | null) {
  if (!v) return null;
  try { return `${v.slice(0,10)}…${v.slice(-6)}`; } catch { return 'invalid'; }
}

export async function GET(request: NextRequest) {
  const raw = request.headers.get('cookie') ?? '';
  const cookieNames = request.cookies.getAll().map(c => c.name);
  const access = request.cookies.get('access_token')?.value || null;
  const refresh = request.cookies.get('refresh_token')?.value || null;

  return NextResponse.json({
    cookieHeaderLength: raw.length,
    cookies: cookieNames,
    accessTokenPreview: mask(access),
    refreshTokenPreview: mask(refresh),
  });
}
