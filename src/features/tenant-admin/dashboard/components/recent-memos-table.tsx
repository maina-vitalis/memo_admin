"use client";

import { useMemo } from "react";
import Link from "next/link";
import { createRecentMemosColumns } from "@/features/tenant-admin/dashboard/components/recent-memos-columns";
import type { RecentMemo } from "@/features/tenant-admin/dashboard/types/dashboard";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";

type RecentMemosTableProps = {
  data: RecentMemo[];
  isLoading?: boolean;
  onViewMemo: (id: string) => void;
};

export function RecentMemosTable({ data, isLoading, onViewMemo }: RecentMemosTableProps) {
  const columns = useMemo(() => createRecentMemosColumns(onViewMemo), [onViewMemo]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Recent memos
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest communications sent to your institution
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/memos">View all</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage="No memos have been sent yet."
        containerClassName="rounded-none border-0 shadow-none"
      />
    </div>
  );
}
