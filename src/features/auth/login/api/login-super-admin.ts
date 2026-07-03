/**
 * [REFRESH TOKENS + AXIOS] Updated to use centralized axios client (like tenant).
 * Returns refreshToken and lets auth-storage handle persistence.
 */
import adminAxios from "@/features/auth/api/axios-auth-client";
import type { SuperAdminLoginResult } from "@/features/auth/types";
import { applyLoginResult } from "@/features/auth/auth-storage";
import { getOrCreateDeviceId } from "@/features/auth/device"; // [REFRESH TOKENS]

export class SuperAdminLoginError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SuperAdminLoginError";
  }
}

export async function loginSuperAdmin(
  email: string,
  password: string,
): Promise<SuperAdminLoginResult> {
  try {
    const { data } = await adminAxios.post("/superadmin/login", {
      email: email.trim().toLowerCase(),
      password,
      deviceType: "web",
      deviceId: getOrCreateDeviceId(),
    });

    const result: SuperAdminLoginResult = {
      role: "super-admin",
      ...data.data,
    };

    applyLoginResult(result);
    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new SuperAdminLoginError(
      error?.response?.data?.message || error?.message || "Invalid credentials",
      error?.response?.status,
    );
  }
}
