/**
 * [AUTH] login.ts
 *
 * Login API caller — routes through the Next.js BFF instead of calling NestJS
 * directly. The BFF sets HttpOnly cookies with the tokens and returns only the
 * safe user profile in the response body.
 *
 * After BFF migration:
 * - POST /api/auth/login (Next.js BFF) — not /auth/login (NestJS directly)
 * - Response body contains user profile only; tokens are in HttpOnly cookies.
 * - applyLoginResult() dispatches the profile to Redux (no token stored).
 */

import axios from 'axios';
import { applyLoginResult } from '@/features/auth/auth-storage';
import type { LoginInput, LoginResult } from '@/features/auth/types';
import { Role } from '@/lib/rbac/role.enum';

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

/** Shape of the safe data returned by the BFF (tokens already stripped). */
type BffLoginResponse = {
  tokenType?: 'Bearer';
  expiresIn?: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    institutionId: string | null;
  };
  institution?: {
    id: string;
    name: string;
    subdomain: string;
  } | null;
  mustChangePassword?: boolean;
};

/** [AUTH] Unified login — calls the Next.js BFF which proxies to NestJS and
 *  sets HttpOnly cookies. Safe user profile is returned for Redux hydration. */
export async function login(input: LoginInput): Promise<LoginResult> {
  const email = input.email.trim().toLowerCase();

  try {
    // Call BFF, not NestJS directly. withCredentials ensures cookies are
    // accepted from the same-origin Next.js server response.
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: input.password,
        deviceType: 'web',
        deviceId:
          typeof window !== 'undefined'
            ? localStorage.getItem('memo_device_id') ?? undefined
            : undefined,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({})) as { message?: string | string[] };
      const raw = errBody?.message;
      const message = Array.isArray(raw) ? raw[0] : raw;
      throw new LoginError(message ?? 'Invalid credentials');
    }

    const json = await res.json() as { data?: BffLoginResponse } | BffLoginResponse;

    // BFF wraps: { data: { user, institution, ... } }
    const data = (json as { data?: BffLoginResponse }).data ?? (json as BffLoginResponse);

    const result: LoginResult = {
      tokenType: data.tokenType,
      expiresIn: data.expiresIn,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
        institutionId: data.user.institutionId,
      },
      institution: data.institution ?? null,
      mustChangePassword: data.mustChangePassword,
    };

    // Hydrate Redux with user profile (no token — it's in the HttpOnly cookie)
    applyLoginResult(result);
    return result;
  } catch (err) {
    if (err instanceof LoginError) throw err;
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as { message?: string | string[] } | undefined;
      const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new LoginError(message ?? 'Invalid credentials');
    }
    const message = err instanceof Error ? err.message : 'Invalid credentials';
    throw new LoginError(message);
  }
}