import { tenantApi } from "../../shared/api/client";

export interface Department {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export async function getDepartments(): Promise<Department[]> {
  return tenantApi<Department[]>("/departments", {
    method: "GET",
  });
}
