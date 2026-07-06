import apiClient from "@/lib/api/axios-client";
import type { CompleteAccountSetupInput } from "@/features/auth/account-setup/types/account-setup";
import type { LoginResult } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";
import axios from "axios";

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

type ApiEnvelope<T> = { success: true; data: T };

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
  try {
    const { data: raw } = await apiClient.post<
      ApiEnvelope<CompleteSetupResponse> | CompleteSetupResponse
    >("/auth/setup/complete", {
      token: input.token,
      password: input.password,
      deviceType: "web",
    });

    const result =
      raw && typeof raw === "object" && "data" in raw
        ? (raw as ApiEnvelope<CompleteSetupResponse>).data
        : (raw as CompleteSetupResponse);

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
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string | string[] } | undefined;
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : (data?.message ?? "Failed to complete account setup");
      throw new CompleteAccountSetupError(message, err.response?.status);
    }
    throw new CompleteAccountSetupError(
      err instanceof Error ? err.message : "Failed to complete account setup",
    );
  }
}