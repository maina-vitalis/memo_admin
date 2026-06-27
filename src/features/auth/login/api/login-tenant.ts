import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import type { TenantLoginResult } from "@/features/auth/types";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";

type TenantLoginResponse = Omit<TenantLoginResult, "role">;

export class TenantLoginError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TenantLoginError";
  }
}

async function requestTenantLogin(
  subdomain: string,
  email: string,
  password: string,
): Promise<TenantLoginResponse> {
  const response = await fetch(`${tenantApiConfig.baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subdomain: subdomain.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
      deviceType: "web",
    }),
  });

  try {
    return await parseApiResponse<TenantLoginResponse>(
      response,
      "Invalid credentials",
    );
  } catch (error) {
    throw new TenantLoginError(
      error instanceof Error ? error.message : "Invalid credentials",
      response.status,
    );
  }
}

export async function loginTenantAdmin(
  subdomain: string,
  email: string,
  password: string,
): Promise<TenantLoginResult> {
  const normalizedSubdomain = subdomain.trim().toLowerCase();

  const result = await requestTenantLogin(
    normalizedSubdomain,
    email,
    password,
  );

  return {
    role: "tenant-admin",
    ...result,
  };
}
