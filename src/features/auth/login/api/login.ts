import { discoverInstitution } from "@/features/auth/login/api/discover-institution";
import { loginSuperAdmin } from "@/features/auth/login/api/login-super-admin";
import { loginTenantAdmin } from "@/features/auth/login/api/login-tenant";
import type { LoginInput, LoginResult } from "@/features/auth/types";

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
    // Ignore and proceed to discover institution for tenant login
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
      tenantError instanceof Error
        ? tenantError.message
        : "Invalid credentials",
    );
  }
}
