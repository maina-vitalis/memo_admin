import type {
  ProvisionTenantInput,
  ProvisionTenantResult,
} from "@/features/super-admin/provisioning/types/provision-tenant";
import {
  superAdminApi,
  withMockDelay,
} from "@/features/super-admin/shared/api/client";
import { superAdminConfig } from "@/features/super-admin/shared/config";
import type { ProvisionInstitutionResponse } from "@/features/super-admin/shared/types/institution";

const RESERVED_SUBDOMAINS = new Set(["www", "admin", "api", "app", "mail"]);

const EXISTING_SHORTCODES = new Set(["KNP", "TENP", "NNP", "TKNP"]);

async function provisionTenantMock(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
  await withMockDelay(null, 800);

  if (RESERVED_SUBDOMAINS.has(input.subdomainSlug)) {
    throw new Error("This subdomain is reserved. Choose a different slug.");
  }

  if (EXISTING_SHORTCODES.has(input.shortcode)) {
    throw new Error("This shortcode is already in use.");
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
  };
}

export async function provisionTenant(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
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
}
