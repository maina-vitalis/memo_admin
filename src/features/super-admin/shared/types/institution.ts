import type { TenantStatus } from "@/features/super-admin/dashboard/types/tenant";

export type InstitutionStatus = TenantStatus;

export type InstitutionRecord = {
  id: string;
  name: string;
  subdomain: string;
  schoolCode: string;
  plan: "trial" | "basic" | "pro";
  status: InstitutionStatus;
  logoUrl: string | null;
  contactEmail: string;
  seatQuota: number;
  subscriptionEndsAt: string | null;
  provisioningNotes: string | null;
  countryCode: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProvisionInstitutionResponse = {
  id: string;
  name: string;
  subdomain: string;
  shortcode: string;
  status: InstitutionStatus;
  seatQuota: number;
  rootUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  message: string;
};
