"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMemo } from "@/features/tenant-admin/memos/api/delete-memo";
import { memoLedgerQueryKeys } from "@/features/tenant-admin/memos/api/use-memo-ledger";

export function useDeleteMemo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMemo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoLedgerQueryKeys.all });
    },
  });
}
