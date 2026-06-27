import { getTenantAccessToken } from "@/features/auth/auth-access";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const tenantApiConfig = {
  baseUrl: API_BASE,
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

function formatErrorMessage(body: { message?: string | string[] } | null, status: number) {
  if (!body?.message) {
    return `Request failed (${status})`;
  }

  return Array.isArray(body.message) ? body.message.join(", ") : body.message;
}

export async function tenantApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getTenantAccessToken();
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${tenantApiConfig.baseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;

    throw new TenantApiError(
      formatErrorMessage(body, response.status),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}


