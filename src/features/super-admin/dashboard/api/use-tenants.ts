"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTenants } from "@/features/super-admin/dashboard/api/tenants";
import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";

export const tenantQueryKeys = {
  all: ["tenants"] as const,
  list: (filters: TenantFilters) => [...tenantQueryKeys.all, filters] as const,
};

export function useTenants(filters: TenantFilters) {
  return useQuery({
    queryKey: tenantQueryKeys.list(filters),
    queryFn: () => fetchTenants(filters),
    placeholderData: (previous) => previous,
  });
}
