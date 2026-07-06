/**
 * Global Axios client for the memo admin app.
 *
 * - Single source of truth for attaching access tokens.
 * - Proactive refresh: refreshes the token if it expires in < 90 s.
 * - Reactive refresh: queues concurrent 401 failures and retries them
 *   with the new token instead of triggering duplicate refresh calls.
 * - On unrecoverable failure: dispatches logout + redirects to /login.
 *
 * Import `apiClient` wherever you need to make an authenticated (or
 * unauthenticated) HTTP request. Do NOT use the raw `fetch` API or
 * create separate axios instances.
 */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_BASE_URL } from "@/lib/api/config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuth,
} from "@/features/auth/auth-storage";
import { getStore } from "@/store/store";
import { logout, refreshAccessToken } from "@/features/auth/store/auth-slice";
import { getSecondsUntilExpiry } from "@/features/auth/jwt";

// ---------------------------------------------------------------------------
// Main client
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// ---------------------------------------------------------------------------
// Raw client — no interceptors; used only for /auth/refresh calls so we
// don't risk infinite loops when the interceptor itself needs to refresh.
// ---------------------------------------------------------------------------

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ---------------------------------------------------------------------------
// Refresh queue — ensures only one refresh call is in-flight at a time.
// Any 401 that arrives while a refresh is already running is queued and
// retried with the new token once the refresh resolves.
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function enqueueRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function notifyRefreshSubscribers(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function flushRefreshSubscribers() {
  refreshSubscribers = [];
}

// ---------------------------------------------------------------------------
// Helper — call /auth/refresh and persist the new tokens
// ---------------------------------------------------------------------------

async function doTokenRefresh(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const { data } = await refreshClient.post("/auth/refresh", { refreshToken });

  // Backend wraps responses as { success: true, data: { accessToken, refreshToken } }
  const payload = data?.data ?? data;
  const newAccess: string = payload.accessToken;
  const newRefresh: string | undefined = payload.refreshToken;

  setAccessToken(newAccess);
  if (newRefresh) setRefreshToken(newRefresh);

  // Keep Redux store in sync so role-aware selectors always see the fresh token
  getStore().dispatch(refreshAccessToken(newAccess));

  return newAccess;
}

// ---------------------------------------------------------------------------
// Helpers — session teardown
// ---------------------------------------------------------------------------

function handleAuthFailure() {
  flushRefreshSubscribers();
  getStore().dispatch(logout());
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ---------------------------------------------------------------------------
// Request interceptor — attach token; proactively refresh if near expiry
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getAccessToken();

    const isRefreshEndpoint = config.url?.includes("/auth/refresh");

    if (!isRefreshEndpoint) {
      const secondsLeft = getSecondsUntilExpiry(token);
      const isNearExpiry = secondsLeft !== null && secondsLeft < 90;

      if (isNearExpiry && !isRefreshing) {
        try {
          token = await doTokenRefresh();
        } catch {
          // Fall through — let the 401 response interceptor handle it
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

// ---------------------------------------------------------------------------
// Response interceptor — on 401 trigger refresh + retry (with queue)
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    // If the refresh endpoint itself returned 401 → session is dead
    if (original?.url?.includes("/auth/refresh")) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await doTokenRefresh();
          notifyRefreshSubscribers(newToken);

          // Retry the original request with the new token
          original.headers = original.headers ?? ({} as never);
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        } catch {
          handleAuthFailure();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Another refresh is already in-flight — queue this request
      return new Promise((resolve) => {
        enqueueRefreshSubscriber((newToken) => {
          original.headers = original.headers ?? ({} as never);
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
