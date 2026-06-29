import { tenantApi } from "../../shared/api/client";

export interface Role {
  id: string;
  name: string;
  hierarchyLevel: number;
  isActive: boolean;
}

export async function getRoles(): Promise<Role[]> {
  return tenantApi<Role[]>("/roles", {
    method: "GET",
  });
}
