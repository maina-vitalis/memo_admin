import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./get-users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}
