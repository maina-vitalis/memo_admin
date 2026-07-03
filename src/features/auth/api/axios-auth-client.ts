/**
 * [REFRESH TOKENS + AXIOS FOR ADMIN]
 * Axios-based authenticated client for the Next.js admin app.
 *
 * Goals (per plan):
 * - Single source of truth for attaching tokens.
 * - Centralized refresh with subscriber queue (avoid duplicate refreshes).
 * - Consistent with mobile implementation.
 *
 * Current storage: Uses the existing redux + localStorage via auth-access.
 * Future (recommended): Move refreshToken to httpOnly cookie set by backend.
 *
 * Every API call in admin should prefer using this (or an instance created from it).
 */

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { API_BASE_URL } from "@/lib/api/config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuth,
} from "@/features/auth/auth-storage";
import { store } from "@/store/store";
import { logout } from "@/features/auth/store/auth-slice";
import { getSecondsUntilExpiry } from "@/features/auth/jwt"; // [PROACTIVE REFRESH]

const adminAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// --- Refresh queue (same battle-tested pattern) ---
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function onRefreshFailed() {
  refreshSubscribers = [];
}

// Dedicated raw client (no interceptors) to safely call /auth/refresh from inside interceptors
const rawAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Request interceptor: attach token + proactive refresh when expiring soon
adminAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getAccessToken();

    // [PROACTIVE REFRESH] If the access token expires in less than ~90s, refresh first.
    // This is the senior-engineer pattern to avoid jarring 401s for the user.
    const secondsLeft = getSecondsUntilExpiry(token);
    const shouldProactiveRefresh =
      secondsLeft !== null &&
      secondsLeft < 90 &&
      !config.url?.includes("/auth/refresh");

    if (shouldProactiveRefresh) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await rawAxios.post("/auth/refresh", { refreshToken });
          const newAccess = data.accessToken;
          const newRefresh = data.refreshToken;

          setAccessToken(newAccess);
          if (newRefresh) setRefreshToken(newRefresh);

          token = newAccess;
        } catch {
          // Let the 401 path handle full failure
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

// 401 -> refresh + retry with queue
adminAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (status === 401 && !original._retry) {
      if (original.url?.includes("/auth/refresh")) {
        store.dispatch(logout());
        clearAuth();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = getRefreshToken();
          if (!refreshToken) throw new Error("Missing refresh token");

          const { data } = await rawAxios.post("/auth/refresh", {
            refreshToken,
          });

          const newAccess = data.accessToken;
          const newRefresh = data.refreshToken;

          setAccessToken(newAccess);
          if (newRefresh) setRefreshToken(newRefresh);

          onRefreshed(newAccess);

          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${newAccess}`;
          return adminAxios(original);
        } catch (refreshErr) {
          onRefreshFailed();
          store.dispatch(logout());
          clearAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          if (!original.headers) original.headers = {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          resolve(adminAxios(original));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default adminAxios;
