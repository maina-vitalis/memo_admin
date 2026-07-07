import { useMutation, useQueryClient } from "@tanstack/react-query";
import { provisionUser } from "./provision-user";
import type { ProvisionUserFormValues } from "../schemas/provision-user.schema";

export function useProvisionUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProvisionUserFormValues) => provisionUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["institution-users"] });
    },
  });
}
