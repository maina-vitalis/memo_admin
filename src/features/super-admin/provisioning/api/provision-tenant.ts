import type {
  ProvisionTenantInput,
  ProvisionTenantResult,
} from "@/features/super-admin/provisioning/types/provision-tenant";
import { apiRequest } from "@/lib/api/http";

type BackendProvisionResult = {
  id: string;
  name: string;
  subdomain: string;
  shortcode: string;
  status: ProvisionTenantResult["status"];
  seatQuota: number;
  message?: string;
};

export async function provisionTenant(
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
