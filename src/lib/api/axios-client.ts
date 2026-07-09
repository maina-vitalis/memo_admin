/**
 * Global Axios client for the memo admin app.
 *
 * BFF Cookie Auth Model (after migration):
 * - The browser automatically sends the `memo_access` HttpOnly cookie on every
 *   request because `withCredentials: true` is set.
 * - There is NO manual Authorization header injection — the NestJS JWT strategy
 *   reads the cookie directly via its extractor chain.
 * - Token refresh is handled by calling the Next.js BFF `/api/auth/refresh`
 *   route, which reads the `memo_refresh` HttpOnly cookie server-side and
 *   issues new cookies in the response headers. No token values are exposed
 *   to JavaScript at any point.
 *
 * Refresh queue:
 * - Only one refresh call is ever in-flight at a time.
 * - Concurrent 401 failures are queued and retried after the refresh resolves.
 * - On unrecoverable failure (refresh endpoint returns 401): dispatches logout
 *   and redirects to /login.
 *
 * Mobile is NOT affected — it calls NestJS directly with Bearer tokens and
 * never touches this client.
 */

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { clearAuth } from "@/features/auth/auth-storage";
import { getStore } from "@/store/store";
import { logout } from "@/features/auth/store/auth-slice";

// ---------------------------------------------------------------------------
// Main client — withCredentials sends HttpOnly cookies automatically
// ---------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true, // Browser sends memo_access HttpOnly cookie on every request
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// ---------------------------------------------------------------------------
// Refresh client — plain fetch-style axios; no interceptors so we avoid
// infinite loops when the interceptor itself triggers a refresh call.
// Points at the Next.js origin (no baseURL) because the BFF is a Next.js
// Route Handler, not a NestJS endpoint.
// ---------------------------------------------------------------------------

const refreshClient = axios.create({
  // No baseURL — /api/auth/refresh is a Next.js Route Handler (BFF),
  // not a NestJS endpoint. Relative URL resolves against the browser's origin.
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Required so the BFF can read the memo_refresh cookie
  timeout: 15_000,
});

// ---------------------------------------------------------------------------
// Refresh queue — one refresh in-flight, rest are queued and retried.
// ---------------------------------------------------------------------------

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];
let rejectQueue: Array<(err: unknown) => void> = [];

function enqueueWaiter(resolve: () => void, reject: (err: unknown) => void) {
  refreshQueue.push(resolve);
  rejectQueue.push(reject);
}

function notifyQueue() {
  refreshQueue.forEach((fn) => fn());
  refreshQueue = [];
  rejectQueue = [];
}

function rejectQueueWith(err: unknown) {
  rejectQueue.forEach((fn) => fn(err));
  refreshQueue = [];
  rejectQueue = [];
}

// ---------------------------------------------------------------------------
// Token refresh — calls the BFF which handles everything server-side.
// No token value is ever returned to this function.
// ---------------------------------------------------------------------------

async function doTokenRefresh(): Promise<void> {
  // BFF reads the HttpOnly memo_refresh cookie itself.
  // We send an empty body — nothing needs to be passed from JS.
  const res = await refreshClient.post("/api/auth/refresh", {});
  if (res.status !== 200) {
    throw new Error("Refresh failed");
  }
  // New cookies are set by the BFF in the Set-Cookie response headers.
  // The browser updates them automatically — no JS action needed.
}

// ---------------------------------------------------------------------------
// Auth failure — flush queue, clear local state, redirect to login
// ---------------------------------------------------------------------------

function handleAuthFailure() {
  rejectQueueWith(new Error("Session expired"));
  getStore().dispatch(logout());
  clearAuth();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ---------------------------------------------------------------------------
// Request interceptor — no token injection needed; cookie is sent automatically.
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Nothing to do — the browser sends memo_access automatically via
  // withCredentials. Authorization header injection is intentionally removed.
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — on 401: trigger BFF refresh + retry original request
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    // If the BFF refresh endpoint itself returned 401 → session is dead.
    if (original?.url?.includes("/api/auth/refresh")) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await doTokenRefresh();
          notifyQueue();

          // Retry the original request — browser re-sends the fresh cookie.
          return apiClient(original);
        } catch {
          handleAuthFailure();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Another refresh is already in-flight — queue this request.
      return new Promise((resolve, reject) => {
        enqueueWaiter(
          () => resolve(apiClient(original)),
          (err) => reject(err),
        );
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
