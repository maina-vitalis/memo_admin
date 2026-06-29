import { tenantApi } from "../../shared/api/client";
import type { UserInRole } from "./get-users";

export async function deleteUser(userId: string): Promise<UserInRole> {
  return tenantApi<UserInRole>(`/users/${userId}`, {
    method: "DELETE",
  });
}
