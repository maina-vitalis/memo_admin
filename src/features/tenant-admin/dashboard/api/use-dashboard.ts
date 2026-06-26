"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/features/tenant-admin/dashboard/api/get-dashboard";

export const dashboardQueryKeys = {
  all: ["tenant-dashboard"] as const,
  summary: () => [...dashboardQueryKeys.all, "summary"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: getDashboardSummary,
  });
}
