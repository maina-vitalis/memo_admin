import { NextRequest, NextResponse } from 'next/server';

/**
 * [BFF] POST /api/auth/login
 *
 * Receives credentials from the browser, forwards them to the NestJS backend
 * server-to-server, then sets HttpOnly cookies with the returned tokens.
 *
 * The browser never sees the raw token values — they live in HttpOnly cookies
 * that are inaccessible to JavaScript (XSS-proof).
 *
 * Safe payload (user profile, institution, mustChangePassword, tokenType) is
 * returned in the response body so Redux can hydrate non-sensitive UI state.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';
const IS_PROD = process.env.NODE_ENV === 'production';

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

  // Backend wraps: { success: true, data: { accessToken, refreshToken, ... } }
  const payload = json?.data ?? json;

  // Strip raw tokens — they must never reach the browser in the response body.
  const { accessToken, refreshToken, expiresIn, ...safeData } = payload;

  const response = NextResponse.json({ data: safeData });

  // Set HttpOnly cookies — JS in the browser cannot read these.
  response.cookies.set('memo_access', accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: expiresIn ?? 15 * 60, // seconds — matches backend jwt.accessExpiresIn
  });

  if (refreshToken) {
    response.cookies.set('memo_refresh', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days — matches backend jwt.refreshExpiresIn
    });
  }

  return response;
}
