"use client";

import { useQuery } from "@tanstack/react-query";
import { getMemoLedger } from "@/features/tenant-admin/memos/api/get-memo-ledger";

export const memoLedgerQueryKeys = {
  all: ["memo-ledger"] as const,
  list: (page: number, pageSize: number) =>
    [...memoLedgerQueryKeys.all, page, pageSize] as const,
};

export function useMemoLedger(page: number, pageSize: number) {
  return useQuery({
    queryKey: memoLedgerQueryKeys.list(page, pageSize),
    queryFn: () => getMemoLedger(page, pageSize),
    placeholderData: (previous) => previous,
  });
}
