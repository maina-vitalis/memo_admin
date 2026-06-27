import { apiRequest } from "@/lib/api/http";
import { setAccessToken } from "@/lib/auth/session";
import type {
  SuperAdminLoginInput,
  SuperAdminLoginResult,
} from "@/features/super-admin/auth/types/login";

export async function loginSuperAdmin(
  input: SuperAdminLoginInput,
): Promise<SuperAdminLoginResult> {
  const result = await apiRequest<SuperAdminLoginResult>("/superadmin/login", {
    method: "POST",
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });

  setAccessToken(result.accessToken);
  return result;
}
