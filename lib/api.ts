import { clearToken, getToken } from "./auth";
import type {
  ApiError,
  ApiSuccess,
  Institution,
  PlatformLoginResponse,
  ProvisionInstitutionInput,
  ProvisionInstitutionResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export class ApiRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
  }
}

function formatMessage(message: string | string[]): string {
  return Array.isArray(message) ? message.join(", ") : message;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !payload.success) {
    if (response.status === 401 && auth) {
      clearToken();
    }

    const message =
      "message" in payload
        ? formatMessage(payload.message)
        : "Request failed";

    throw new ApiRequestError(message, response.status);
  }

  return payload.data;
}

export function platformLogin(email: string, password: string) {
  return request<PlatformLoginResponse>(
    "/platform/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );
}

export function listInstitutions() {
  return request<Institution[]>("/platform/institutions");
}

export function provisionInstitution(input: ProvisionInstitutionInput) {
  return request<ProvisionInstitutionResponse>(
    "/platform/institutions/provision",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
