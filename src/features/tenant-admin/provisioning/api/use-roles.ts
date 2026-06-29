import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./get-roles";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}
