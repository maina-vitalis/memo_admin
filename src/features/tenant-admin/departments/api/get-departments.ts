import { tenantApi } from "../../shared/api/client";

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  code: string | null;
  headUserId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getDepartments(): Promise<Department[]> {
  return tenantApi<Department[]>("/departments", {
    method: "GET",
  });
}
