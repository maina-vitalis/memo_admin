"use client";

import { useState } from "react";
import { DashboardHeader } from "@/features/tenant-admin/dashboard/components/dashboard-header";
import { DashboardKpiGrid } from "@/features/tenant-admin/dashboard/components/dashboard-kpi-grid";
import { DashboardSeatUsageCard } from "@/features/tenant-admin/dashboard/components/dashboard-seat-usage-card";
import { RecentMemosTable } from "@/features/tenant-admin/dashboard/components/recent-memos-table";
import { MemoDetailSheet } from "@/features/tenant-admin/memos/components/memo-detail-sheet";
import { useDashboardSummary } from "@/features/tenant-admin/dashboard/api/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const { data, isLoading, isFetching, isError, error } = useDashboardSummary();
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
  const loading = isLoading || isFetching;

  if (isError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Failed to load dashboard</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "An unexpected error occurred while loading the dashboard."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
            onViewMemo={setSelectedMemoId}
          />
        </div>
      </div>

      <MemoDetailSheet
        memoId={selectedMemoId}
        onOpenChange={(open) => {
          if (!open) setSelectedMemoId(null);
        }}
      />
    </div>
  );
}
