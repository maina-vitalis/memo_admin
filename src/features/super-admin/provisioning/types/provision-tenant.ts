import type { TenantStatus } from "@/features/super-admin/dashboard/types/tenant";

export type ProvisionTenantInput = {
  institutionName: string;
  shortcode: string;
  subdomainSlug: string;
  seatQuota: number;
  initialStatus: Extract<TenantStatus, "trial" | "active" | "pending">;
  subscriptionDays: number;
  adminEmail: string;
  adminFullName: string;
  provisioningNotes?: string;
};

export type ProvisionTenantResult = {
  id: string;
  name: string;
  subdomain: string;
  shortcode: string;
  status: TenantStatus;
  seatQuota: number;
};
