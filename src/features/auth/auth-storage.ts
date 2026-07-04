import { getStore } from "@/store/store";
import { selectAccessToken } from "./store/auth-selectors";
import { applyAuthSession, refreshAccessToken } from "./store/auth-slice";
import type { LoginResult } from "./types";
import { API_BASE_URL } from "@/lib/api/config";

export {
  loadAuthFromStorage,
  saveAuthToStorage,
  clearAuthStorage as clearAuth,
} from "./store/auth-persistence";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return selectAccessToken(getStore().getState()) ?? null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("memo_refresh_token");
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  getStore().dispatch(refreshAccessToken(token));
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("memo_refresh_token", token);
}

export function applyLoginResult(result: LoginResult) {

  console.log("Applying login result:", result);
  getStore().dispatch(applyAuthSession(result));
  if (result.refreshToken) {
    setRefreshToken(result.refreshToken);
  }
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("memo_refresh_token");
}

/** [AUTH] Unified logout — single /auth/logout endpoint. */
export async function serverLogout() {
  const refresh = getRefreshToken();

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getAccessToken()
          ? { Authorization: `Bearer ${getAccessToken()}` }
          : {}),
      },
      body: refresh ? JSON.stringify({ refreshToken: refresh }) : undefined,
    });
  } catch {
    // ignore network errors on logout
  } finally {
    clearTokens();
  }
}