/**
 * Super-admin API helper.
 *
 * Wraps `apiClient` (axios) with the same public signature previously
 * provided by the fetch-based `superAdminApi` function.
 * Token attachment and refresh are handled by the global interceptors.
 */

import apiClient from "@/lib/api/axios-client";
import axios from "axios";

export class SuperAdminApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SuperAdminApiError";
  }
}

function extractMessage(
  data: { message?: string | string[] } | null,
  status: number,
): string {
  if (!data?.message) return `Request failed (${status})`;
  return Array.isArray(data.message) ? data.message.join(", ") : data.message;
}

export async function superAdminApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const body =
    typeof init?.body === "string" ? JSON.parse(init.body) : init?.body;

  try {
    const { data: raw } = await apiClient.request<
      { success: true; data: T } | T
    >({
      url: path,
      method,
      data: body,
    });

    // Unwrap envelope if present
    if (
      raw &&
      typeof raw === "object" &&
      "success" in (raw as object) &&
      "data" in (raw as object)
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
      throw new SuperAdminApiError(extractMessage(responseData, status), status);
    }
    throw err;
  }
}
