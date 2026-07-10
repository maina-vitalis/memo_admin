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
  if (role === Role.SUPER_ADMIN) return "/super-admin";
  if (role === Role.INSTITUTION_ADMIN) return "/admin";
  throw new PortalAccessError();
}

export class PortalAccessError extends Error {
  constructor(
    message = "This account is not authorized to access the admin portal. Please use the mobile app.",
  ) {
    super(message);
    this.name = "PortalAccessError";
  }
}

export function canAccessAdminPortal(role: Role): boolean {
  return role === Role.SUPER_ADMIN || role === Role.INSTITUTION_ADMIN;
}

export function isSuperAdmin(role: Role | null): boolean {
  return role === Role.SUPER_ADMIN;
}

/** Only institution admins may use the /admin tenant console. */
export function isTenantAdminPortalRole(role: Role | null): boolean {
  return role === Role.INSTITUTION_ADMIN;
}

/** @deprecated Use isTenantAdminPortalRole for /admin access checks. */
export function isInstitutionPortalRole(role: Role | null): boolean {
  return isTenantAdminPortalRole(role);
}
