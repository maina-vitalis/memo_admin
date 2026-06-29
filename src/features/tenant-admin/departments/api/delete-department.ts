import { tenantApi } from "../../shared/api/client";
import type { Department } from "./get-departments";

export async function deleteDepartment(
  departmentId: string,
): Promise<Department> {
  return tenantApi<Department>(`/departments/${departmentId}`, {
    method: "DELETE",
  });
}
