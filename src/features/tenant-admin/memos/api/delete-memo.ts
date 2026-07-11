import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export async function deleteMemo(id: string): Promise<void> {
  await tenantApi<void>(`/memos/${id}`, { method: "DELETE" });
}
