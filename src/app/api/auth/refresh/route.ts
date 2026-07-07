import { NextRequest, NextResponse } from 'next/server';

/**
 * [BFF] POST /api/auth/refresh
 *
 * Reads the HttpOnly refresh cookie (invisible to browser JS), exchanges it
 * with the NestJS backend for a new token pair, then updates both HttpOnly
 * cookies. If the refresh fails the cookies are cleared, forcing re-login.
 *
 * The browser sends nothing in the request body — the BFF handles everything.
 * Concurrent 401 retries are queued in the axios-client before hitting this
 * route so at most one refresh call is ever in-flight.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';
const IS_PROD = process.env.NODE_ENV === 'production';

function clearAuthCookies(response: NextResponse) {
  response.cookies.set('memo_access', '', { maxAge: 0, path: '/', httpOnly: true });
  response.cookies.set('memo_refresh', '', { maxAge: 0, path: '/', httpOnly: true });
}

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('memo_refresh')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const json = await backendRes.json();

  if (!backendRes.ok) {
    // Refresh failed — clear cookies and signal the client to re-login.
    const response = NextResponse.json(json, { status: backendRes.status });
    clearAuthCookies(response);
    return response;
  }

  const payload = json?.data ?? json;

  const {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn,
    ...safeData
  } = payload;

  const response = NextResponse.json({ data: safeData });

  response.cookies.set('memo_access', accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: expiresIn ?? 15 * 60,
  });

  if (newRefreshToken) {
    response.cookies.set('memo_refresh', newRefreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}
