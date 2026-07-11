"use client";

import { useMemo } from "react";
import { createMemoLedgerColumns } from "@/features/tenant-admin/memos/components/memo-ledger-columns";
import type { MemoLedgerRow } from "@/features/tenant-admin/memos/types/memo";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type MemoLedgerTableProps = {
  data: MemoLedgerRow[];
  total: number;
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onViewMemo: (id: string) => void;
};

export function MemoLedgerTable({
  data,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
  onViewMemo,
}: MemoLedgerTableProps) {
  const columns = useMemo(
    () => createMemoLedgerColumns(onViewMemo),
    [onViewMemo],
  );

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage="No memos have been sent yet."
        containerClassName="rounded-none border-0 shadow-none"
        tableOptions={{
          manualPagination: true,
          pageCount: Math.max(1, Math.ceil(total / pageSize)),
        }}
      />

      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        start={start}
        end={end}
        onPageChange={onPageChange}
      />
    </div>
  );
}
