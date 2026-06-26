const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const tenantApiConfig = {
  baseUrl: API_BASE,
  useMock: !API_BASE,
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

export async function tenantApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${tenantApiConfig.baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new TenantApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function withMockDelay<T>(data: T, ms = 300): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}
