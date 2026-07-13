"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsSummary } from "@/features/super-admin/analytics/api/get-analytics";

export const analyticsQueryKeys = {
  summary: ["analytics", "summary"] as const,
};

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: analyticsQueryKeys.summary,
    queryFn: fetchAnalyticsSummary,
    staleTime: 60_000,
  });
}
