import type { TenantFilters } from "@/features/super-admin/dashboard/schemas/tenant-filters.schema";
import type { Tenant, TenantsResponse } from "@/features/super-admin/dashboard/types/tenant";
import {
  superAdminApi,
  withMockDelay,
} from "@/features/super-admin/shared/api/client";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import type { InstitutionRecord } from "@/features/super-admin/shared/types/institution";
import { mapInstitutionToTenant } from "@/features/super-admin/shared/utils/map-institution";

const MOCK_TENANTS: Tenant[] = [
  {
    id: "kabete",
    name: "Kabete National Polytechnic",
    subdomain: "kabete",
    shortcode: "KNP",
    status: "active",
    seatsActive: 450,
    seatQuota: 500,
    usersActive: 12_500,
    subscriptionEndsLabel: "Oct 12, 2024",
    subscriptionEndsVariant: "default",
  },
  {
    id: "eldoret",
    name: "Eldoret National Polytechnic",
    subdomain: "eldoret",
    shortcode: "TENP",
    status: "pending",
    seatsActive: 0,
    seatQuota: 100,
    usersActive: 0,
    subscriptionEndsLabel: "Ends in 5 days",
    subscriptionEndsVariant: "warning",
  },
  {
    id: "nyeri",
    name: "Nyeri National Polytechnic",
    subdomain: "nyeri",
    shortcode: "NNP",
    status: "suspended",
    seatsActive: 250,
    seatQuota: 250,
    usersActive: 0,
    subscriptionEndsLabel: "Ended Jan 15, 2024",
    subscriptionEndsVariant: "error",
  },
  {
    id: "kisumu",
    name: "Kisumu National Polytechnic",
    subdomain: "kisumu",
    shortcode: "TKNP",
    status: "trial",
    seatsActive: 45,
    seatQuota: 50,
    usersActive: 32,
    subscriptionEndsLabel: "Ends in 12 days",
    subscriptionEndsVariant: "warning",
  },
  ...Array.from({ length: 43 }, (_, index) => {
    const id = `tenant-${index + 5}`;
    return {
      id,
      name: `TVET Institute ${index + 5}`,
      subdomain: id,
      shortcode: `T${index + 5}`,
      status: "active" as const,
      seatsActive: 120 + index,
      seatQuota: 300,
      usersActive: 800 + index * 10,
      subscriptionEndsLabel: "Dec 31, 2025",
      subscriptionEndsVariant: "default" as const,
    };
  }),
];

function matchesSearch(tenant: Tenant, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return (
    tenant.name.toLowerCase().includes(query) ||
    tenant.shortcode.toLowerCase().includes(query) ||
    tenant.subdomain.toLowerCase().includes(query)
  );
}

function paginateTenants(tenants: Tenant[], filters: TenantFilters): TenantsResponse {
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

async function fetchTenantsMock(filters: TenantFilters): Promise<TenantsResponse> {
  await withMockDelay(null);
  return paginateTenants(MOCK_TENANTS, filters);
}

async function fetchTenantsFromApi(
  filters: TenantFilters,
): Promise<TenantsResponse> {
  const institutions = await superAdminApi<InstitutionRecord[]>(
    "/superadmin/institutions",
  );

  const tenants = institutions.map(mapInstitutionToTenant);
  return paginateTenants(tenants, filters);
}

export async function fetchTenants(
  filters: TenantFilters,
): Promise<TenantsResponse> {
  if (superAdminConfig.useMock) {
    return fetchTenantsMock(filters);
  }

  return fetchTenantsFromApi(filters);
}
