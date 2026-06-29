import { useQuery } from "@tanstack/react-query";
import { getUsersForInstitution } from "./get-users";

export function useInstitutionUsers() {
  return useQuery({
    queryKey: ["institution-users"],
    queryFn: getUsersForInstitution,
  });
}
