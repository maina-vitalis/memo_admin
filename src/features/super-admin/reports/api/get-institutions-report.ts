import { fetchInstitutionRecords } from "@/features/super-admin/shared/api/institutions";
import { mapInstitutionToTenant } from "@/features/super-admin/shared/utils/map-institution";
import type { Tenant } from "@/features/super-admin/dashboard/types/tenant";

export async function fetchInstitutionsReport(): Promise<Tenant[]> {
  const institutions = await fetchInstitutionRecords();
  return institutions.map(mapInstitutionToTenant);
}
