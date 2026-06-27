import { parseApiResponse } from "@/features/auth/api/parse-api-response";
import { tenantApiConfig } from "@/features/tenant-admin/shared/api/client";

export type DiscoveredInstitutionResponse = {
  id: string;
  name: string;
  shortcode: string;
  subdomain: string;
};

/**
 * Discovers an institution's subdomain given the user's email.
 */
export async function discoverInstitution(
  email: string,
): Promise<DiscoveredInstitutionResponse> {
  const response = await fetch(
    `${tenantApiConfig.baseUrl}/institutions/discover`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: email.trim().toLowerCase(),
        mode: "email",
      }),
    },
  );

  return parseApiResponse<DiscoveredInstitutionResponse>(
    response,
    "Institution not found for this email.",
  );
}
