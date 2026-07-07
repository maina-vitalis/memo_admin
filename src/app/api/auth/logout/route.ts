import { NextRequest, NextResponse } from 'next/server';

/**
 * [BFF] POST /api/auth/logout
 *
 * Reads the HttpOnly cookies to forward tokens to NestJS for server-side
 * session revocation, then clears both cookies with Max-Age=0.
 *
 * IMPORTANT: Only a server-side Set-Cookie response can clear HttpOnly
 * cookies — document.cookie in the browser cannot touch them.
 *
 * The NestJS call is best-effort. Even if it fails (network error, already
 * expired session), the browser cookies are always cleared so the user is
 * effectively logged out on the admin side.
 */

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('memo_access')?.value;
  const refreshToken = request.cookies.get('memo_refresh')?.value;

  // Best-effort: tell NestJS to revoke the session.
  // Wrapped in try/catch — logout must never be blocked by a network failure.
  try {
    await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
    });
  } catch {
    // Network error — still proceed to clear browser cookies below.
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });

  // Only the server can clear HttpOnly cookies — clear both regardless of
  // whether the NestJS call succeeded.
  response.cookies.set('memo_access', '', { maxAge: 0, path: '/', httpOnly: true });
  response.cookies.set('memo_refresh', '', { maxAge: 0, path: '/', httpOnly: true });

  return response;
}
