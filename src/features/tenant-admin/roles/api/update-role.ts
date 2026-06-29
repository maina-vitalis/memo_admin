import { tenantApi } from "../../shared/api/client";
import type { RoleWithDetails } from "./get-roles";

export interface UpdateRolePayload {
  name?: string;
  hierarchyLevel?: number;
  sendScope?: Record<string, unknown>;
  contentAccess?: Record<string, unknown>;
  adminRights?: Record<string, unknown>;
}

export async function updateRole(
  roleId: string,
  data: UpdateRolePayload,
): Promise<RoleWithDetails> {
  return tenantApi<RoleWithDetails>(`/roles/${roleId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
