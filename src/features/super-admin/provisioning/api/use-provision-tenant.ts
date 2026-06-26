"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { provisionTenant } from "@/features/super-admin/provisioning/api/provision-tenant";
import { tenantQueryKeys } from "@/features/super-admin/dashboard/api/use-tenants";
import type { ProvisionTenantInput } from "@/features/super-admin/provisioning/types/provision-tenant";

export function useProvisionTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProvisionTenantInput) => provisionTenant(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tenantQueryKeys.all });
    },
  });
}
