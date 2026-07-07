/**
 * Tenant-admin API helper.
 *
 * Wraps `apiClient` (axios) with the same public signature previously
 * provided by the fetch-based `tenantApi` function.
 * Token attachment and refresh are handled by the global interceptors.
 */

import apiClient from "@/lib/api/axios-client";
import { API_BASE_URL } from "@/lib/api/config";
import axios from "axios";

/** @deprecated — use API_BASE_URL from @/lib/api/config directly */
export const tenantApiConfig = {
  baseUrl: API_BASE_URL,
  useMock: false,
} as const;

export class TenantApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TenantApiError";
  }
}

function extractMessage(
  data: { message?: string | string[] } | null,
  status: number,
): string {
  if (!data?.message) return `Request failed (${status})`;
  return Array.isArray(data.message) ? data.message.join(", ") : data.message;
}

export async function tenantApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  const body = isFormData
    ? init.body
    : typeof init?.body === "string"
      ? JSON.parse(init.body)
      : init?.body;

  try {
    const { data: raw, status } = await apiClient.request<
      { success: true; data: T } | T
    >({
      url: path,
      method,
      data: body,
      // The shared instance defaults to Content-Type: application/json, which
      // would make axios try to JSON-serialize FormData instead of sending it
      // as multipart. Clearing it lets the browser set the correct boundary.
      headers: isFormData ? { "Content-Type": undefined } : undefined,
    });

    if (status === 204) return undefined as T;

    // Unwrap envelope if present
    if (
      raw &&
      typeof raw === "object" &&
      "data" in (raw as object) &&
      "success" in (raw as object)
    ) {
      return (raw as { success: true; data: T }).data;
    }

    return raw as T;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const responseData = err.response?.data as
        | { message?: string | string[] }
        | null;
      const status = err.response?.status ?? 0;
      throw new TenantApiError(extractMessage(responseData, status), status);
    }
    throw err;
  }
}
