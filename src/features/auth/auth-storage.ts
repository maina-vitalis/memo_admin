/**
 * [AUTH] auth-storage.ts
 *
 * Public facade for auth state helpers.
 *
 * After BFF migration:
 * - Raw token helpers (getRefreshToken, setRefreshToken, setAccessToken,
 *   clearTokens) are REMOVED. Tokens live in HttpOnly cookies managed
 *   exclusively by the Next.js BFF — JS cannot read or write them.
 * - applyLoginResult() dispatches user profile to Redux (no token stored).
 * - serverLogout() calls the BFF /api/auth/logout route which clears the
 *   HttpOnly cookies server-side. Only a server Set-Cookie can do this.
 */

import { getStore } from '@/store/store';
import { applyAuthSession } from './store/auth-slice';
import type { LoginResult } from './types';

export {
  loadAuthFromStorage,
  saveAuthToStorage,
  clearAuthStorage as clearAuth,
} from './store/auth-persistence';

/** [AUTH] Hydrate Redux with the safe user profile returned by the BFF login response. */
export function applyLoginResult(result: LoginResult) {
  getStore().dispatch(applyAuthSession(result));
}

/** [AUTH] Logout — calls the BFF which clears HttpOnly cookies server-side.
 *  document.cookie cannot clear HttpOnly cookies — only this server route can. */
export async function serverLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Required so the BFF receives the HttpOnly cookies
    });
  } catch {
    // Ignore network errors — logout must never block the UI
  }
}