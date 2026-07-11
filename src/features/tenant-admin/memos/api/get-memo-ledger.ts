import { tenantApi } from "@/features/tenant-admin/shared/api/client";
import type { MemoLedgerResponse } from "@/features/tenant-admin/memos/types/memo";

export async function getMemoLedger(
  page: number,
  pageSize: number,
): Promise<MemoLedgerResponse> {
  return tenantApi<MemoLedgerResponse>(
    `/admin/dashboard/memos?page=${page}&pageSize=${pageSize}`,
  );
}
