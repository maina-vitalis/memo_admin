"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { recentMemosColumns } from "@/features/tenant-admin/dashboard/components/recent-memos-columns";
import type { RecentMemo } from "@/features/tenant-admin/dashboard/types/dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type RecentMemosTableProps = {
  data: RecentMemo[];
  isLoading?: boolean;
};

export function RecentMemosTable({ data, isLoading }: RecentMemosTableProps) {
  const table = useReactTable({
    data,
    columns: recentMemosColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnCount = recentMemosColumns.length;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent memos</h3>
          <p className="text-sm text-muted-foreground">
            Latest communications sent to your institution
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/memos">View all</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-medium tracking-wider text-muted-foreground uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-background">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No memos have been sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
