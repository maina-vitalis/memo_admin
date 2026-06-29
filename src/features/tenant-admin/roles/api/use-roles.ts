import { useQuery } from "@tanstack/react-query";
import { getRolesForInstitution } from "./get-roles";

export function useInstitutionRoles() {
  return useQuery({
    queryKey: ["institution-roles"],
    queryFn: getRolesForInstitution,
  });
}
