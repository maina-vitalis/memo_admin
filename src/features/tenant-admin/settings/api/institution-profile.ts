import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export type InstitutionProfile = {
  id: string;
  name: string;
  subdomain: string;
  schoolCode: string;
  contactEmail: string;
  logoUrl: string | null;
  timezone: string;
  countryCode: string;
};

export async function fetchMyInstitution(
  institutionId: string,
): Promise<InstitutionProfile> {
  return tenantApi<InstitutionProfile>(`/institutions/${institutionId}`);
}

export type UpdateInstitutionProfileInput = {
  name?: string;
  contactEmail?: string;
  logoUrl?: string;
  timezone?: string;
};

export async function updateMyInstitution(
  institutionId: string,
  data: UpdateInstitutionProfileInput,
): Promise<InstitutionProfile> {
  return tenantApi<InstitutionProfile>(`/institutions/${institutionId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
