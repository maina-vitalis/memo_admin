import { getSuperAdminAccessToken } from "@/features/auth/auth-access";
import { superAdminConfig } from "@/features/super-admin/shared/config";

type ApiErrorBody = {
  message?: string | string[];
};

type ApiSuccessBody<T> = {
  success: true;
  data: T;
};

export class SuperAdminApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "SuperAdminApiError";
  }
}

function formatErrorMessage(body: ApiErrorBody | null, status: number) {
  if (!body?.message) {
    return `Request failed (${status})`;
  }

  return Array.isArray(body.message) ? body.message.join(", ") : body.message;
}

export async function superAdminApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getSuperAdminAccessToken();
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${superAdminConfig.apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  const body = (await response.json().catch(() => null)) as
    | ApiSuccessBody<T>
    | ApiErrorBody
    | null;

  if (!response.ok) {
    throw new SuperAdminApiError(
      formatErrorMessage(body as ApiErrorBody | null, response.status),
      response.status,
    );
  }

  if (body && typeof body === "object" && "data" in body) {
    return body.data;
  }

  return body as T;
}


