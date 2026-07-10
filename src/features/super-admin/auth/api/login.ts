import { login, LoginError } from "@/features/auth/login/api/login";
import type { LoginResult } from "@/features/auth/types";
import type { SuperAdminLoginInput } from "@/features/super-admin/auth/types/login";
import { serverLogout } from "@/features/auth/auth-storage";
import { Role } from "@/lib/rbac/role.enum";
import axios from "axios";

export async function loginSuperAdmin(
  input: SuperAdminLoginInput,
): Promise<LoginResult> {
  try {
    const result = await login(input);

    if (result.user.role !== Role.SUPER_ADMIN) {
      await serverLogout();
      throw new SuperAdminLoginError(
        "This account is not authorized for super admin access",
      );
    }

    return result;
  } catch (err) {
    if (err instanceof SuperAdminLoginError) throw err;
    if (err instanceof LoginError) {
      throw new SuperAdminLoginError(err.message);
    }
    throw new SuperAdminLoginError(
      extractAxiosErrorMessage(err, "Unable to sign in. Try again."),
    );
  }
}

export class SuperAdminLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SuperAdminLoginError";
  }
}

export function extractAxiosErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string | string[] }
      | undefined;
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    return message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}
