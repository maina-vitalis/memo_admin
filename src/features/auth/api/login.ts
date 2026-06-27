import { discoverInstitution } from "@/features/auth/api/discover-institution";
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

  // 1. Attempt to login as Platform Admin (Super Admin) first
  try {
    return await loginSuperAdmin(email, password);
  } catch (superAdminError) {
    // If mock mode is on and it fails, just throw immediately since
    // tenant mock login also wouldn't know which institution to mock without discovering
    if (superAdminConfig.useMock) {
      throw new LoginError(
        superAdminError instanceof Error
          ? superAdminError.message
          : "Invalid credentials",
      );
    }
  }

  // 2. If Super Admin fails, discover the institution using the email
  let subdomain: string;
  try {
    const institution = await discoverInstitution(email);
    subdomain = institution.subdomain;
  } catch (discoverError) {
    throw new LoginError("Invalid credentials");
  }

  // 3. Attempt to login as Tenant Admin with the discovered subdomain
  try {
    return await loginTenantAdmin(subdomain, email, password);
  } catch (tenantError) {
    throw new LoginError(
      tenantError instanceof Error ? tenantError.message : "Invalid credentials",
    );
  }
}

