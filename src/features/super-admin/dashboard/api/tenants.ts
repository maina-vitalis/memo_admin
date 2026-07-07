import { format, formatDistanceToNow, isPast, differenceInDays } from "date-fns";
import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import type {
  SubscriptionEndsVariant,
  Tenant,
  TenantStatus,
  TenantsResponse,
} from "@/features/super-admin/dashboard/types/tenant";
import { apiRequest } from "@/lib/api/http";

type BackendInstitution = {
  id: string;
  name: string;
  subdomain: string;
  schoolCode: string;
  status: TenantStatus;
  seatQuota: number;
  subscriptionEndsAt: string | null;
  plan: "trial" | "basic" | "pro";
  contactEmail: string;
  isActive: boolean;
  provisioningNotes: string | null;
  usersActive?: number;
  seatsActive?: number;
};

function subscriptionLabel(
  endsAt: string | null,
): { label: string; variant: SubscriptionEndsVariant } {
  if (!endsAt) {
    return { label: "Not set", variant: "default" };
  }

  const date = new Date(endsAt);

  if (isPast(date)) {
    return {
      label: `Ended ${format(date, "MMM d, yyyy")}`,
      variant: "error",
    };
  }

  const daysLeft = differenceInDays(date, new Date());

  if (daysLeft <= 14) {
    return {
      label: `Ends ${formatDistanceToNow(date, { addSuffix: true })}`,
      variant: "warning",
    };
  }

  return {
    label: format(date, "MMM d, yyyy"),
    variant: "default",
  };
}

function mapInstitution(institution: BackendInstitution): Tenant {
  const { label, variant } = subscriptionLabel(institution.subscriptionEndsAt);

  return {
    id: institution.id,
    name: institution.name,
    subdomain: institution.subdomain,
    shortcode: institution.schoolCode,
    status: institution.status,
    seatsActive: institution.seatsActive ?? 0,
    seatQuota: institution.seatQuota,
    usersActive: institution.usersActive ?? 0,
    subscriptionEndsLabel: label,
    subscriptionEndsVariant: variant,
    plan: institution.plan,
    contactEmail: institution.contactEmail,
    isActive: institution.isActive,
    provisioningNotes: institution.provisioningNotes ?? undefined,
  };
}

function matchesSearch(tenant: Tenant, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return (
    tenant.name.toLowerCase().includes(query) ||
    tenant.shortcode.toLowerCase().includes(query) ||
    tenant.subdomain.toLowerCase().includes(query)
  );
}

function paginateTenants(
  tenants: Tenant[],
  filters: TenantFilters,
): TenantsResponse {
  const filtered = tenants.filter((tenant) => {
    const statusMatch =
      filters.status === "all" || tenant.status === filters.status;
    return statusMatch && matchesSearch(tenant, filters.search);
  });

  const start = (filters.page - 1) * filters.pageSize;
  const items = filtered.slice(start, start + filters.pageSize);

  return {
    items,
    total: filtered.length,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export async function fetchTenants(
  filters: TenantFilters,
): Promise<TenantsResponse> {
  const institutions = await apiRequest<BackendInstitution[]>(
    "/superadmin/institutions",
    { auth: true },
  );

  return paginateTenants(institutions.map(mapInstitution), filters);
}

export async function updateTenant(
  id: string,
  data: Partial<Omit<Tenant, "id" | "subdomain" | "shortcode">>,
): Promise<Tenant> {
  return apiRequest<Tenant>(`/superadmin/institutions/${id}`, {
    method: "PATCH",
    auth: true,
    body: data,
  });
}

export async function deleteTenant(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    `/superadmin/institutions/${id}`,
    {
      method: "DELETE",
      auth: true,
    },
  );
}
