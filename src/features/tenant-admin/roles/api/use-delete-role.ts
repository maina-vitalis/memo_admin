import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "./delete-role";

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-roles"] });
      queryClient.invalidateQueries({ queryKey: ["institution-users"] });
    },
  });
}
