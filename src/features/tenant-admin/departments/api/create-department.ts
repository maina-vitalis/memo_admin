import { tenantApi } from "../../shared/api/client";
import type { Department } from "./get-departments";

export interface CreateDepartmentPayload {
  name: string;
  code?: string;
  headUserId?: string;
}

export async function createDepartment(
  data: CreateDepartmentPayload,
): Promise<Department> {
  return tenantApi<Department>("/departments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
