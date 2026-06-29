import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "./update-role";
import type { UpdateRolePayload } from "./update-role";

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: UpdateRolePayload }) =>
      updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-roles"] });
    },
  });
}
