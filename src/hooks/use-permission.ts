"use client";

import { useAppSelector } from "@/store/hooks";
import { ROLE_PERMISSIONS } from "@/lib/rbac/role-permissions";
import { Permission } from "@/lib/rbac/permission.enum";
import { Role } from "@/lib/rbac/role.enum";
import { selectAuthRole } from "@/features/auth/store/auth-selectors";

/** [RBAC] Checks if the current user's role grants a permission. */
export function usePermission(permission: Permission): boolean {
  const role = useAppSelector(selectAuthRole);
  if (!role) return false;
  return (ROLE_PERMISSIONS[role as Role] ?? []).includes(permission);
}

/** [RBAC] Returns all permissions for the current user's role. */
export function usePermissions(): Permission[] {
  const role = useAppSelector(selectAuthRole);
  if (!role) return [];
  return ROLE_PERMISSIONS[role as Role] ?? [];
}