import type {
  ProvisionTenantInput,
  ProvisionTenantResult,
} from "@/features/super-admin/provisioning/types/provision-tenant";
import { apiConfig } from "@/lib/api/config";
import { apiRequest } from "@/lib/api/http";

const RESERVED_SUBDOMAINS = new Set(["www", "admin", "api", "app", "mail"]);

type BackendProvisionResult = {
  id: string;
  name: string;
  subdomain: string;
  shortcode: string;
  status: ProvisionTenantResult["status"];
  seatQuota: number;
  message?: string;
};

async function provisionTenantMock(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (RESERVED_SUBDOMAINS.has(input.subdomainSlug)) {
    throw new Error("This subdomain is reserved. Choose a different slug.");
  }

  return {
    id: input.subdomainSlug,
    name: input.institutionName,
    subdomain: input.subdomainSlug,
    shortcode: input.shortcode,
    status: input.initialStatus,
    seatQuota: input.seatQuota,
  };
}

async function provisionTenantApi(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
  const result = await apiRequest<BackendProvisionResult>(
    "/superadmin/institutions/provision",
    {
      method: "POST",
      auth: true,
      body: {
        institutionName: input.institutionName,
        shortcode: input.shortcode,
        subdomainSlug: input.subdomainSlug,
        seatQuota: input.seatQuota,
        initialStatus: input.initialStatus,
        subscriptionDays: input.subscriptionDays,
        adminEmail: input.adminEmail,
        adminFullName: input.adminFullName,
        provisioningNotes: input.provisioningNotes,
      },
    },
  );

  return {
    id: result.id,
    name: result.name,
    subdomain: result.subdomain,
    shortcode: result.shortcode,
    status: result.status,
    seatQuota: result.seatQuota,
  };
}

export async function provisionTenant(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
  if (apiConfig.useMock) {
    return provisionTenantMock(input);
  }

  return provisionTenantApi(input);
}
