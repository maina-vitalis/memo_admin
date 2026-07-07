import { tenantApi } from "../../shared/api/client";
import type { UserInRole } from "./get-users";

export interface UpdateUserPayload {
  role?: string;
  departmentId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export async function updateUser(
  userId: string,
  data: UpdateUserPayload,
): Promise<UserInRole> {
  return tenantApi<UserInRole>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
