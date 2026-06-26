"use client";

import { DashboardHeader } from "@/features/tenant-admin/dashboard/components/dashboard-header";
import { DashboardKpiGrid } from "@/features/tenant-admin/dashboard/components/dashboard-kpi-grid";
import { DashboardSeatUsageCard } from "@/features/tenant-admin/dashboard/components/dashboard-seat-usage-card";
import { RecentMemosTable } from "@/features/tenant-admin/dashboard/components/recent-memos-table";
import { useDashboardSummary } from "@/features/tenant-admin/dashboard/api/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardKpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

export function InstitutionDashboardPage() {
  const { data, isLoading, isFetching } = useDashboardSummary();
  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      <DashboardHeader
        institutionName={data?.institution.name}
        shortcode={data?.institution.shortcode}
        isLoading={loading}
      />

      {loading ? (
        <DashboardKpiSkeleton />
      ) : (
        <DashboardKpiGrid kpis={data?.kpis ?? []} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading ? (
          <Skeleton className="h-48 rounded-xl lg:col-span-1" />
        ) : data ? (
          <DashboardSeatUsageCard seatUsage={data.seatUsage} />
        ) : null}

        <div className="lg:col-span-2">
          <RecentMemosTable
            data={data?.recentMemos ?? []}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
