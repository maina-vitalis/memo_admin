/**
 * [REFRESH TOKENS + AXIOS MIGRATION]
 * Example of updated login using axios-auth-client.
 * Other calls should migrate to the new client over time.
 */
import adminAxios from "@/features/auth/api/axios-auth-client";
import type { TenantLoginResult } from "@/features/auth/types";
import { applyLoginResult } from "@/features/auth/auth-storage";
import { getOrCreateDeviceId } from "@/features/auth/device"; // [REFRESH TOKENS] stable deviceId for web too

export class TenantLoginError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "TenantLoginError";
  }
}

export async function loginTenantAdmin(
  subdomain: string,
  email: string,
  password: string,
): Promise<TenantLoginResult> {
  const normalizedSubdomain = subdomain.trim().toLowerCase();

  try {
    const { data } = await adminAxios.post("/auth/login", {
      subdomain: normalizedSubdomain,
      email: email.trim().toLowerCase(),
      password,
      deviceType: "web",
      deviceId: getOrCreateDeviceId(), // [REFRESH TOKENS]
    });

    const result: TenantLoginResult = {
      role: "tenant-admin",
      ...data,
    };

    applyLoginResult(result);
    return result;
  } catch (error: any) {
    throw new TenantLoginError(
      error?.response?.data?.message || error?.message || "Invalid credentials",
      error?.response?.status,
    );
  }
}
