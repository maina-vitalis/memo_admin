import apiClient from "@/lib/api/axios-client";
import { applyLoginResult } from "@/features/auth/auth-storage";
import type {
  SuperAdminLoginInput,
  SuperAdminLoginResult,
} from "@/features/super-admin/auth/types/login";
import axios from "axios";

type ApiEnvelope<T> = { success: true; data: T };

export async function loginSuperAdmin(
  input: SuperAdminLoginInput,
): Promise<SuperAdminLoginResult> {
  const { data: raw } = await apiClient.post<
    ApiEnvelope<SuperAdminLoginResult> | SuperAdminLoginResult
  >("/superadmin/login", {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });

  const result =
    raw && typeof raw === "object" && "data" in raw
      ? (raw as ApiEnvelope<SuperAdminLoginResult>).data
      : (raw as SuperAdminLoginResult);

  // Persist tokens & hydrate Redux state via the shared auth-storage helper
  applyLoginResult(result as Parameters<typeof applyLoginResult>[0]);

  return result;
}

export class SuperAdminLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SuperAdminLoginError";
  }
}

export function extractAxiosErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    return message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
}
