import { loginSuperAdmin } from "@/features/auth/api/login-super-admin";
import { loginTenantAdmin } from "@/features/auth/api/login-tenant";
import type { LoginInput, LoginResult } from "@/features/auth/types";
import { superAdminConfig } from "@/features/super-admin/shared/config";

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LoginError";
  }
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const institutionSubdomain = input.institutionSubdomain?.trim().toLowerCase();

  if (!institutionSubdomain) {
    try {
      return await loginSuperAdmin(email, password);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in";

      throw new LoginError(
        superAdminConfig.useMock
          ? message
          : "Invalid credentials. Institution admins must provide an institution code.",
      );
    }
  }

  try {
    return await loginTenantAdmin(institutionSubdomain, email, password);
  } catch (tenantError) {
    try {
      return await loginSuperAdmin(email, password);
    } catch {
      const message =
        tenantError instanceof Error
          ? tenantError.message
          : "Failed to sign in";

      throw new LoginError(message);
    }
  }
}
