import axios from "axios";
import apiClient from "@/lib/api/axios-client";
import { applyLoginResult } from "@/features/auth/auth-storage";
import type { LoginInput, LoginResult } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

type LoginApiResponse = {
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
  } | null;
  mustChangePassword?: boolean;
};

/** [AUTH] Unified login — single /auth/login for all roles. */
export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();

  try {
    const { data: body } = await apiClient.post<{ success: boolean; data: LoginApiResponse } | LoginApiResponse>("/auth/login", {
      email,
      password: input.password,
      deviceType: "web",
      deviceId:
        typeof window !== "undefined"
          ? localStorage.getItem("memo_device_id") ?? undefined
          : undefined,
    });

    // Backend wraps responses as { success: true, data: payload }
    const data = (body as { success: boolean; data: LoginApiResponse }).data ?? (body as LoginApiResponse);

    const result: LoginResult = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType,
      expiresIn: data.expiresIn,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        institutionId: data.user.institutionId,
      },
      institution: data.institution ?? null,
      mustChangePassword: data.mustChangePassword,
    };

    applyLoginResult(result);
    return result;
  } catch (err) {
    if (err instanceof LoginError) throw err;
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as
        | { message?: string | string[] }
        | undefined;
      const message = Array.isArray(data?.message)
        ? data.message[0]
        : data?.message;
      throw new LoginError(message ?? "Invalid credentials");
    }
    const message =
      err instanceof Error ? err.message : "Invalid credentials";
    throw new LoginError(message);
  }
}