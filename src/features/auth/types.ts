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

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
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