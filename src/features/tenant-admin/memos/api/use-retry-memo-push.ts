"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryMemoPush } from "@/features/tenant-admin/memos/api/retry-memo-push";

export function useRetryMemoPush() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryMemoPush(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({
        queryKey: ["memo-ledger", "memo", id],
      });
    },
  });
}
