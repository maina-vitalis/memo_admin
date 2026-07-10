import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/api/set-auth-cookies';
import { Role } from '@/lib/rbac/role.enum';

const PORTAL_DENIED_MESSAGE =
  'This account is not authorized to access the admin portal. Please use the mobile app.';

/**
 * [BFF] POST /api/auth/setup/complete
 *
 * Completes institution-admin account setup, sets HttpOnly cookies from the
 * returned tokens, and returns only the safe user profile to the browser.
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

  if (safeData?.user?.role !== Role.INSTITUTION_ADMIN) {
    return NextResponse.json({ message: PORTAL_DENIED_MESSAGE }, { status: 403 });
  }

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
