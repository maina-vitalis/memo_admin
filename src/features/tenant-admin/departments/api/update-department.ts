import { tenantApi } from "../../shared/api/client";
import type { Department } from "./get-departments";

export interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  headUserId?: string | null;
}

export async function updateDepartment(
  departmentId: string,
  data: UpdateDepartmentPayload,
): Promise<Department> {
  return tenantApi<Department>(`/departments/${departmentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
