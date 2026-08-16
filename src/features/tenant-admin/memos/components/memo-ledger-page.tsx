"use client";

import { useCallback, useState } from "react";
import { useMemoLedger } from "@/features/tenant-admin/memos/api/use-memo-ledger";
import { MemoLedgerTable } from "@/features/tenant-admin/memos/components/memo-ledger-table";
import { MemoDetailSheet } from "@/features/tenant-admin/memos/components/memo-detail-sheet";
import { DeleteAllMemosDialog } from "@/features/tenant-admin/memos/components/delete-all-memos-dialog";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const PAGE_SIZE = 10;

export function MemoLedgerPage() {
  const [page, setPage] = useState(1);
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
  const { data, isLoading, isFetching, isError, error } = useMemoLedger(
    page,
    PAGE_SIZE,
  );

  const handlePageChange = useCallback((next: number) => {
    setPage(next);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Memo Ledger"
        description="Central memo ledger and traceability across your institution."
        action={
          <DeleteAllMemosDialog totalMemos={data?.total ?? 0} />
        }
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load memos</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading memos."}
          </AlertDescription>
        </Alert>
      ) : (
        <MemoLedgerTable
          data={data?.items ?? []}
          total={data?.total ?? 0}
          page={page}
          pageSize={PAGE_SIZE}
          isLoading={isLoading || isFetching}
          onPageChange={handlePageChange}
          onViewMemo={setSelectedMemoId}
        />
      )}

      <MemoDetailSheet
        memoId={selectedMemoId}
        onOpenChange={(open) => {
          if (!open) setSelectedMemoId(null);
        }}
      />
    </div>
  );
}
