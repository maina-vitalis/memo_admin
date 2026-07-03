/**
 * [REFRESH TOKENS] Thin storage helpers for admin app.
 *
 * These wrap the existing redux-persist + direct localStorage access
 * so that the new axios client and login flows have a clean API.
 *
 * Current implementation still uses localStorage (acceptable start).
 * Recommended future: httpOnly cookie for the refreshToken (requires small
 * Next.js API route proxy for /auth/login and /auth/refresh that sets cookies).
 *
 * All functions are safe for SSR (they check for window).
 */

import { store } from "@/store/store";
import {
  selectAccessToken,
  selectTenantAccessToken,
  selectSuperAdminAccessToken,
} from "./store/auth-selectors";
import { applyAuthSession } from "./store/auth-slice";
import type { LoginResult } from "./types";
import { API_BASE_URL } from "@/lib/api/config";

// Re-export useful existing
export {
  loadAuthFromStorage,
  saveAuthToStorage,
  clearAuthStorage as clearAuth,
} from "./store/auth-persistence";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const state = store.getState();
  return selectAccessToken(state) ?? null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  // We augment storage with a dedicated key for refresh
  return localStorage.getItem("memo_refresh_token");
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  // For tenant or super, we update via the existing slice for consistency
  // This is a bit coarse - in real usage after login we use applyAuthSession
  localStorage.setItem("memo_access_token_temp", token); // transitional
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("memo_refresh_token", token);
}

export function applyLoginResult(result: LoginResult) {
  // This keeps the whole redux + persistence happy
  store.dispatch(applyAuthSession(result));
  if ("refreshToken" in result && result.refreshToken) {
    setRefreshToken(result.refreshToken);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("memo_refresh_token");
  localStorage.removeItem("memo_access_token_temp");
}

/**
 * [REFRESH TOKENS] Best-effort server logout that sends the refresh token for revocation.
 */
export async function serverLogout() {
  const refresh = getRefreshToken();
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
      },
      body: refresh ? JSON.stringify({ refreshToken: refresh }) : undefined,
    });
  } catch {
    // ignore network errors on logout
  } finally {
    clearTokens();
  }
}
