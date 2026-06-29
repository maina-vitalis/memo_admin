import { tenantApi } from "../../shared/api/client";

export interface RoleWithDetails {
  id: string;
  institutionId: string;
  name: string;
  hierarchyLevel: number;
  sendScope: Record<string, unknown>;
  contentAccess: Record<string, unknown>;
  adminRights: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getRolesForInstitution(): Promise<RoleWithDetails[]> {
  return tenantApi<RoleWithDetails[]>("/roles", {
    method: "GET",
  });
}
