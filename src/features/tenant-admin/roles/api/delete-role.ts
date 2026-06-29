import { tenantApi } from "../../shared/api/client";
import type { RoleWithDetails } from "./get-roles";

export async function deleteRole(roleId: string): Promise<RoleWithDetails> {
  return tenantApi<RoleWithDetails>(`/roles/${roleId}`, {
    method: "DELETE",
  });
}
