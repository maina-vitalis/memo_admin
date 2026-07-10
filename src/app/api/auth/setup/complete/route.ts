import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/api/set-auth-cookies';

/**
 * [BFF] POST /api/auth/setup/complete
 *
 * Completes institution-admin account setup, sets HttpOnly cookies from the
 * returned tokens, and returns only the safe user profile to the browser.
 * Mirrors /api/auth/login so post-provisioning redirects to /admin work.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/setup/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(json, { status: backendRes.status });
  }

  const payload = json?.data ?? json;
  const { accessToken, refreshToken, expiresIn, ...safeData } = payload;

  if (!accessToken) {
    return NextResponse.json(
      { message: 'Setup completed but no session was issued' },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ data: safeData });
  setAuthCookies(response, { accessToken, refreshToken, expiresIn });

  return response;
}
