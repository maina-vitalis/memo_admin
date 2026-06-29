import { useMutation } from "@tanstack/react-query";
import { provisionUser } from "./provision-user";
import type { ProvisionUserFormValues } from "../schemas/provision-user.schema";

export function useProvisionUser() {
  return useMutation({
    mutationFn: (data: ProvisionUserFormValues) => provisionUser(data),
  });
}
