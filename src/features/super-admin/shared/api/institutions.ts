import type { InstitutionRecord } from "@/features/super-admin/shared/types/institution";
import { apiRequest } from "@/lib/api/http";

/** Raw institution rows for the signed-in platform admin — backs Analytics and Reports. */
export async function fetchInstitutionRecords(): Promise<InstitutionRecord[]> {
  return apiRequest<InstitutionRecord[]>("/superadmin/institutions", {
    auth: true,
  });
}
