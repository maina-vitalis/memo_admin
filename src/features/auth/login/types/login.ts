/**
 * Represents the two distinct login modes available on the portal.
 * - "super-admin": Platform administrator (no institution required)
 * - "institution-admin": Institution (tenant) administrator
 */
export type LoginMode = "super-admin" | "institution-admin";
