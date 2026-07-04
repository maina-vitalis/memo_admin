import { tenantApi } from "@/features/tenant-admin/shared/api/client";
import { Role } from "@/lib/rbac/role.enum";

export type AssignableRole = {
  role: Role;
  rank: number;
};

/** [RBAC] Fetch roles the current actor may assign (fixed enum, ceiling-filtered). */
export async function getRoles(): Promise<AssignableRole[]> {
  return tenantApi<AssignableRole[]>("/users/assignable-roles");
}