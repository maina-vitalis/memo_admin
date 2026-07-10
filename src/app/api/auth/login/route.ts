import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/api/set-auth-cookies';
import { Role } from '@/lib/rbac/role.enum';

const PORTAL_DENIED_MESSAGE =
  'This account is not authorized to access the admin portal. Please use the mobile app.';

function isPortalRole(role: unknown): role is Role {
  return role === Role.SUPER_ADMIN || role === Role.INSTITUTION_ADMIN;
}

/**
 * [BFF] POST /api/auth/login
 *
 * Receives credentials from the browser, forwards them to the NestJS backend
 * server-to-server, then sets HttpOnly cookies with the returned tokens.
 *
 * Only SUPER_ADMIN and INSTITUTION_ADMIN may sign in to this web portal.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
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
  const role = safeData?.user?.role;

  if (!isPortalRole(role)) {
    return NextResponse.json({ message: PORTAL_DENIED_MESSAGE }, { status: 403 });
  }

  const response = NextResponse.json({ data: safeData });
  setAuthCookies(response, { accessToken, refreshToken, expiresIn });

  return response;
}
