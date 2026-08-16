"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllMemos } from "@/features/tenant-admin/memos/api/delete-all-memos";
import { memoLedgerQueryKeys } from "@/features/tenant-admin/memos/api/use-memo-ledger";

export function useDeleteAllMemos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllMemos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memoLedgerQueryKeys.all });
    },
  });
}
