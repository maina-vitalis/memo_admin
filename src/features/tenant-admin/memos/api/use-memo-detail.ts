"use client";

import { useQuery } from "@tanstack/react-query";
import { getMemoDetail } from "@/features/tenant-admin/memos/api/get-memo-detail";

export function useMemoDetail(id: string | null) {
  return useQuery({
    queryKey: ["memo-ledger", "memo", id],
    queryFn: () => getMemoDetail(id!),
    enabled: !!id,
  });
}
