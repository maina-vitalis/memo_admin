import { tenantApi } from "@/features/tenant-admin/shared/api/client";
import type { DashboardSummary } from "@/features/tenant-admin/dashboard/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return tenantApi<DashboardSummary>("/admin/dashboard");
}
