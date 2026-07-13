/**
 * Thin wrapper around `apiClient` (axios) that preserves the original
 * `apiRequest` call-signature used throughout the super-admin feature set.
 *
 * All requests go through the global interceptors defined in axios-client.ts,
 * so token attachment and refresh happen automatically.
 */

import apiClient from "@/lib/api/axios-client";
import axios from "axios";

// ---------------------------------------------------------------------------
// Shared error type
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string | string[];
};

function extractErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;

  const payload = data as ApiEnvelope<unknown>;

  if (Array.isArray(payload.message)) return payload.message.join(", ");
  if (typeof payload.message === "string") return payload.message;

  return fallback;
}

function unwrapResponse<T>(data: unknown): T {
  if (
    data &&
    typeof data === "object" &&
    "success" in data &&
    (data as ApiEnvelope<T>).success === true &&
    "data" in data
  ) {
    return (data as ApiEnvelope<T>).data as T;
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    /** @deprecated — token attachment is handled automatically by apiClient */
    token?: string | null;
    /** @deprecated — auth is always applied via interceptors; kept for backward compat */
    auth?: boolean;
  } = {},
): Promise<T> {
  const { method = "GET", body } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const { data } = await apiClient.request<unknown>({
      url: path,
      method,
      data: body,
      // The shared instance defaults to Content-Type: application/json, which
      // would make axios try to JSON-serialize FormData instead of sending it
      // as multipart. Clearing it lets the browser set the correct boundary.
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    });

    return unwrapResponse<T>(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data;
      const status = err.response?.status ?? 0;
      throw new ApiError(
        extractErrorMessage(responseData, `Request failed (${status})`),
        status,
      );
    }
    throw err;
  }
}
