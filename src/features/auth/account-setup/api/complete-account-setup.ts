import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import type { CompleteAccountSetupInput } from "@/features/auth/account-setup/types/account-setup";
import type { TenantLoginResult } from "@/features/auth/types";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";

type CompleteSetupResponse = Omit<TenantLoginResult, "role">;

export class CompleteAccountSetupError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "CompleteAccountSetupError";
  }
}

export async function completeAccountSetup(
  input: CompleteAccountSetupInput,
): Promise<TenantLoginResult> {
  const response = await fetch(`${tenantApiConfig.baseUrl}/auth/setup/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: input.token,
      password: input.password,
      deviceType: "web",
    }),
  });

  try {
    const result = await parseApiResponse<CompleteSetupResponse>(
      response,
      "Failed to complete account setup",
    );

    return {
      role: "tenant-admin",
      ...result,
    };
  } catch (error) {
    throw new CompleteAccountSetupError(
      error instanceof Error
        ? error.message
        : "Failed to complete account setup",
      response.status,
    );
  }
}
