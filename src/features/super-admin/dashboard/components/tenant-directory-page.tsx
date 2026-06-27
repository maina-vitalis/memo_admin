"use client";

import { useCallback, useState } from "react";
import { useTenants } from "@/features/super-admin/dashboard/api/use-tenants";
import { TenantDirectoryTable } from "@/features/super-admin/dashboard/components/tenant-directory-table";
import { TenantDirectoryToolbar } from "@/features/super-admin/dashboard/components/tenant-directory-toolbar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  defaultTenantFilters,
  type TenantFilters,
} from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";

export function TenantDirectoryPage() {
  const [filters, setFilters] = useState<TenantFilters>(defaultTenantFilters);
  const { data, isLoading, isFetching, isError, error } = useTenants(filters);

  const handleFiltersChange = useCallback((next: TenantFilters) => {
    setFilters(next);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((current) => ({ ...current, page }));
  }, []);

  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">Tenant Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? "Loading institutions..." : `${total} institutions registered`}
        </p>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load tenant directory</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An unexpected error occurred while loading the tenants."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <TenantDirectoryToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <TenantDirectoryTable
            data={data?.items ?? []}
            total={total}
            filters={filters}
            isLoading={isLoading || isFetching}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
