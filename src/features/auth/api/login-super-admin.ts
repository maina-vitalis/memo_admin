import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import type { SuperAdminLoginResult } from "@/features/auth/types";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import { withMockDelay } from "@/features/super-admin/shared/api/client";

type SuperAdminLoginResponse = Omit<SuperAdminLoginResult, "role">;

export class SuperAdminLoginError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SuperAdminLoginError";
  }
}

async function requestSuperAdminLogin(
  email: string,
  password: string,
): Promise<SuperAdminLoginResponse> {
  const response = await fetch(
    `${superAdminConfig.apiBaseUrl}/superadmin/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    },
  );

  try {
    return await parseApiResponse<SuperAdminLoginResponse>(
      response,
      "Invalid credentials",
    );
  } catch (error) {
    throw new SuperAdminLoginError(
      error instanceof Error ? error.message : "Invalid credentials",
      response.status,
    );
  }
}

export async function loginSuperAdmin(
  email: string,
  password: string,
): Promise<SuperAdminLoginResult> {
  if (superAdminConfig.useMock) {
    await withMockDelay(null);

    return {
      role: "super-admin",
      accessToken: "mock-super-admin-token",
      tokenType: "Bearer",
      expiresIn: "7d",
      superAdmin: {
        id: "mock-super-admin",
        email: email.trim().toLowerCase(),
        firstName: "Platform",
        lastName: "Admin",
      },
    };
  }

  const result = await requestSuperAdminLogin(email, password);

  return {
    role: "super-admin",
    ...result,
  };
}
