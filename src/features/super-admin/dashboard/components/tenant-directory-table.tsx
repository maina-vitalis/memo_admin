"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getTenantTableColumns } from "@/features/super-admin/dashboard/components/tenant-table-columns";
import { TenantTablePagination } from "@/features/super-admin/dashboard/components/tenant-table-pagination";
import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TenantDirectoryTableProps = {
  data: Tenant[];
  total: number;
  filters: TenantFilters;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
};

export function TenantDirectoryTable({
  data,
  total,
  filters,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: TenantDirectoryTableProps) {
  const columns = React.useMemo(
    () => getTenantTableColumns(onEdit, onDelete),
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / filters.pageSize),
  });

  const start = total === 0 ? 0 : (filters.page - 1) * filters.pageSize + 1;
  const end = Math.min(filters.page * filters.pageSize, total);
  const columnCount = columns.length;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "px-4 py-3 text-xs font-medium tracking-wider text-muted-foreground uppercase",
                      header.column.id === "actions" && "text-right",
                      header.column.id === "name" && "min-w-[220px]",
                      header.column.id === "seatQuota" && "min-w-[140px]",
                    )}
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
                    <td key={cellIndex} className="px-4 py-3 align-top">
                      <Skeleton className="h-5 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-background"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-3 align-top text-sm text-foreground",
                        cell.column.id === "actions" && "text-right",
                      )}
                    >
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
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No institutions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TenantTablePagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={total}
        start={start}
        end={end}
        onPageChange={onPageChange}
      />
    </div>
  );
}
