/**
 * [REFRESH TOKENS] Minimal safe JWT decoder for the admin web app.
 * Same as mobile version — only for reading exp for proactive refresh decisions.
 */

export interface DecodedJwt {
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';

    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getSecondsUntilExpiry(token: string | null): number | null {
  if (!token) return null;
  const p = decodeJwt(token);
  if (!p?.exp) return null;
  return p.exp - Math.floor(Date.now() / 1000);
}
