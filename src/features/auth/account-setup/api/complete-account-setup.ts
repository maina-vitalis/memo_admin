import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import type { CompleteAccountSetupInput } from "@/features/auth/account-setup/types/account-setup";
import type { LoginResult } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";

type CompleteSetupResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    institutionId: string | null;
  };
  institution?: {
    id: string;
    name: string;
    subdomain: string;
  };
};

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
): Promise<LoginResult> {
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
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role ?? Role.INSTITUTION_ADMIN,
        institutionId: result.user.institutionId,
      },
      institution: result.institution ?? null,
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