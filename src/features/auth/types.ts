/**
 * [AUTH] types.ts
 *
 * After BFF migration:
 * - LoginResult no longer includes `accessToken` or `refreshToken`.
 *   Tokens are set as HttpOnly cookies by the BFF — they never reach JS.
 * - `expiresIn` is retained for informational use only (e.g. proactive refresh
 *   timing if needed in future, though currently handled by cookie MaxAge).
 */

import { Role } from "@/lib/rbac/role.enum";

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  institutionId: string | null;
};

export type InstitutionSummary = {
  id: string;
  name: string;
  subdomain: string;
};

/** Safe login result — tokens intentionally absent (live in HttpOnly cookies). */
export type LoginResult = {
  tokenType?: "Bearer";
  expiresIn?: number;
  user: AuthUser;
  institution?: InstitutionSummary | null;
  mustChangePassword?: boolean;
};

export function getPostLoginPath(role: Role): string {
  return role === Role.SUPER_ADMIN ? "/super-admin" : "/admin";
}

export function isSuperAdmin(role: Role | null): boolean {
  return role === Role.SUPER_ADMIN;
}

export function isInstitutionPortalRole(role: Role | null): boolean {
  return role !== null && role !== Role.SUPER_ADMIN;
}
