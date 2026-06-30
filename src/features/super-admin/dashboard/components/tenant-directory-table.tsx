"use client";

import * as React from "react";
import { getTenantTableColumns } from "@/features/super-admin/dashboard/components/tenant-table-columns";
import { TenantTablePagination } from "@/features/super-admin/dashboard/components/tenant-table-pagination";
import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";
import { DataTable } from "@/components/data-table/data-table";

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

  const start = total === 0 ? 0 : (filters.page - 1) * filters.pageSize + 1;
  const end = Math.min(filters.page * filters.pageSize, total);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage="No institutions match your filters."
        containerClassName="rounded-none border-0 shadow-none"
        tableOptions={{
          manualPagination: true,
          pageCount: Math.ceil(total / filters.pageSize),
        }}
      />

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
