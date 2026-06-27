import type {
  ProvisionTenantInput,
  ProvisionTenantResult,
} from "@/features/super-admin/provisioning/types/provision-tenant";
<<<<<<< HEAD
import { apiConfig } from "@/lib/api/config";
import { apiRequest } from "@/lib/api/http";
=======
import {
  superAdminApi,
  withMockDelay,
} from "@/features/super-admin/shared/api/client";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import type { ProvisionInstitutionResponse } from "@/features/super-admin/shared/types/institution";
>>>>>>> 8e5303006be458d7f1c79692b03ba1221dfcc55f

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
  await withMockDelay(null, 800);

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

<<<<<<< HEAD
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
=======
function mapProvisionResponse(
  response: ProvisionInstitutionResponse,
): ProvisionTenantResult {
  return {
    id: response.id,
    name: response.name,
    subdomain: response.subdomain,
    shortcode: response.shortcode,
    status: response.status,
    seatQuota: response.seatQuota,
>>>>>>> 8e5303006be458d7f1c79692b03ba1221dfcc55f
  };
}

export async function provisionTenant(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
<<<<<<< HEAD
  if (apiConfig.useMock) {
    return provisionTenantMock(input);
  }

  return provisionTenantApi(input);
=======
  if (superAdminConfig.useMock) {
    return provisionTenantMock(input);
  }

  const response = await superAdminApi<ProvisionInstitutionResponse>(
    "/superadmin/institutions/provision",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return mapProvisionResponse(response);
>>>>>>> 8e5303006be458d7f1c79692b03ba1221dfcc55f
}
