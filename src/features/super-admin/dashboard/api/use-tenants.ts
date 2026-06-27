"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTenants, updateTenant, deleteTenant } from "@/features/super-admin/dashboard/api/tenants";
import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";

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

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Tenant, "id" | "subdomain" | "shortcode">>;
    }) => updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}
