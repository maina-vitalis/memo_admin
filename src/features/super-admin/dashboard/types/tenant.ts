export const TENANT_STATUSES = [
  "active",
  "pending",
  "suspended",
  "trial",
] as const;

export type TenantStatus = (typeof TENANT_STATUSES)[number];

export type SubscriptionEndsVariant = "default" | "warning" | "error";

export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  shortcode: string;
  status: TenantStatus;
  seatsActive: number;
  seatQuota: number;
  usersActive: number;
  subscriptionEndsLabel: string;
  subscriptionEndsVariant: SubscriptionEndsVariant;
  plan: "trial" | "basic" | "pro";
  contactEmail: string;
  isActive: boolean;
  provisioningNotes?: string;
};

export type TenantsResponse = {
  items: Tenant[];
  total: number;
  page: number;
  pageSize: number;
};
