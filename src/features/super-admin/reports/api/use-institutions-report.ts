"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInstitutionsReport } from "@/features/super-admin/reports/api/get-institutions-report";

export const reportsQueryKeys = {
  institutions: ["reports", "institutions"] as const,
};

export function useInstitutionsReport() {
  return useQuery({
    queryKey: reportsQueryKeys.institutions,
    queryFn: fetchInstitutionsReport,
    staleTime: 60_000,
  });
}
