import { tenantApi } from "@/features/tenant-admin/shared/api/client";
import type { MemoDetail } from "@/features/tenant-admin/memos/types/memo";

export async function getMemoDetail(id: string): Promise<MemoDetail> {
  return tenantApi<MemoDetail>(`/admin/dashboard/memos/${id}`);
}
