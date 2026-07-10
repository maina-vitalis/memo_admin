import { NextResponse } from 'next/server';

const IS_PROD = process.env.NODE_ENV === 'production';

type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

/** Set HttpOnly auth cookies on a BFF response (login, setup, refresh). */
export function setAuthCookies(
  response: NextResponse,
  { accessToken, refreshToken, expiresIn }: AuthTokens,
) {
  response.cookies.set('memo_access', accessToken, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: expiresIn ?? 15 * 60,
  });

  if (refreshToken) {
    response.cookies.set('memo_refresh', refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return response;
}
