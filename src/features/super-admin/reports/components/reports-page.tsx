"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useInstitutionsReport } from "@/features/super-admin/reports/api/use-institutions-report";
import {
  ReportsToolbar,
  type ReportFilters,
} from "@/features/super-admin/reports/components/reports-toolbar";
import { reportTableColumns } from "@/features/super-admin/reports/components/report-table-columns";
import { downloadInstitutionsReport } from "@/features/super-admin/reports/utils/export-institutions-report";
import { DataTable } from "@/components/data-table/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DEFAULT_FILTERS: ReportFilters = { search: "", status: "all", plan: "all" };

export function ReportsPage() {
  const { data, isLoading, isFetching, isError, error } = useInstitutionsReport();
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    const rows = data ?? [];
    const query = filters.search.trim().toLowerCase();

    return rows.filter((tenant) => {
      const statusMatch = filters.status === "all" || tenant.status === filters.status;
      const planMatch = filters.plan === "all" || tenant.plan === filters.plan;
      const searchMatch =
        !query ||
        tenant.name.toLowerCase().includes(query) ||
        tenant.shortcode.toLowerCase().includes(query) ||
        tenant.subdomain.toLowerCase().includes(query);

      return statusMatch && planMatch && searchMatch;
    });
  }, [data, filters]);

  const loading = isLoading || isFetching;

  function handleExport() {
    if (filtered.length === 0) {
      toast.error("No institutions match the current filters.");
      return;
    }
    downloadInstitutionsReport(filtered);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading
            ? "Loading institutions..."
            : `${filtered.length} of ${data?.length ?? 0} institutions`}
        </p>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load report data</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading institutions."}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <ReportsToolbar
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
            exportDisabled={loading || filtered.length === 0}
          />

          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <DataTable
              columns={reportTableColumns}
              data={filtered}
              isLoading={loading}
              emptyMessage="No institutions match your filters."
              containerClassName="rounded-none border-0 shadow-none"
            />
          </div>
        </>
      )}
    </div>
  );
}
