"use client";

import { useAnalyticsSummary } from "@/features/super-admin/analytics/api/use-analytics";
import { AnalyticsKpiGrid } from "@/features/super-admin/analytics/components/analytics-kpi-grid";
import { StatusBreakdownChart } from "@/features/super-admin/analytics/components/status-breakdown-chart";
import { PlanBreakdownChart } from "@/features/super-admin/analytics/components/plan-breakdown-chart";
import { SeatUtilizationChart } from "@/features/super-admin/analytics/components/seat-utilization-chart";
import { OnboardingTrendChart } from "@/features/super-admin/analytics/components/onboarding-trend-chart";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

function AnalyticsKpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

function AnalyticsChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-72 rounded-xl" />
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  const { data, isLoading, isFetching, isError, error } = useAnalyticsSummary();
  const loading = isLoading || isFetching;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide trends across every institution on TVET MEMO.
        </p>
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading analytics."}
          </AlertDescription>
        </Alert>
      ) : loading || !data ? (
        <>
          <AnalyticsKpiSkeleton />
          <AnalyticsChartsSkeleton />
        </>
      ) : (
        <>
          <AnalyticsKpiGrid summary={data} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StatusBreakdownChart data={data.statusBreakdown} />
            <PlanBreakdownChart data={data.planBreakdown} />
            <SeatUtilizationChart data={data.seatUtilization} />
            <OnboardingTrendChart data={data.onboardingTrend} />
          </div>
        </>
      )}
    </div>
  );
}
