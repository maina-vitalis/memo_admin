import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export async function deleteAllMemos(): Promise<void> {
  await tenantApi<void>(`/memos`, { method: "DELETE" });
}
