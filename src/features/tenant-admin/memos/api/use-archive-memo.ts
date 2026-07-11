"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveMemo } from "@/features/tenant-admin/memos/api/archive-memo";
import { memoLedgerQueryKeys } from "@/features/tenant-admin/memos/api/use-memo-ledger";

export function useArchiveMemo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveMemo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoLedgerQueryKeys.all });
    },
  });
}
