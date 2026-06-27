import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import type { SetupTokenDetails } from "@/features/auth/account-setup/types/account-setup";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";

export class SetupTokenError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SetupTokenError";
  }
}

export async function verifySetupToken(
  token: string,
): Promise<SetupTokenDetails> {
  const response = await fetch(`${tenantApiConfig.baseUrl}/auth/setup/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  try {
    return await parseApiResponse<SetupTokenDetails>(
      response,
      "Invalid or expired setup link",
    );
  } catch (error) {
    throw new SetupTokenError(
      error instanceof Error ? error.message : "Invalid or expired setup link",
      response.status,
    );
  }
}
