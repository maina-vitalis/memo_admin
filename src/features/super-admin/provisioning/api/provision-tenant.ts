import type {
  ProvisionTenantInput,
  ProvisionTenantResult,
} from "@/features/super-admin/provisioning/types/provision-tenant";

const RESERVED_SUBDOMAINS = new Set(["www", "admin", "api", "app", "mail"]);

const EXISTING_SHORTCODES = new Set(["KNP", "TENP", "NNP", "TKNP"]);

function toSubdomain(slug: string) {
  return `${slug}.nostalqic.com`;
}

function toInstitutionId(slug: string) {
  return slug;
}

export async function provisionTenant(
  input: ProvisionTenantInput,
): Promise<ProvisionTenantResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (RESERVED_SUBDOMAINS.has(input.subdomainSlug)) {
    throw new Error("This subdomain is reserved. Choose a different slug.");
  }

  if (EXISTING_SHORTCODES.has(input.shortcode)) {
    throw new Error("This shortcode is already in use.");
  }

  return {
    id: toInstitutionId(input.subdomainSlug),
    name: input.institutionName,
    subdomain: toSubdomain(input.subdomainSlug),
    shortcode: input.shortcode,
    status: input.initialStatus,
    seatQuota: input.seatQuota,
  };
}
