import { tenantApi } from "../../shared/api/client";

export async function deleteUser(userId: string): Promise<{ id: string }> {
  return tenantApi<{ id: string }>(`/users/${userId}`, {
    method: "DELETE",
  });
}
