import { Role } from "@/lib/rbac/role.enum";

/**
 * All roles a tenant admin can assign, in hierarchy order.
 * SUPER_ADMIN is excluded — it's a platform-level role, not tenant-assignable.
 */
export const ASSIGNABLE_ROLES: Role[] = Object.values(Role).filter(
  (role) => role !== Role.SUPER_ADMIN,
);

export function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}
