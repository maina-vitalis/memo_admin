import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export async function archiveMemo(id: string): Promise<void> {
  await tenantApi<void>(`/memos/${id}/archive`, { method: "PATCH" });
}
