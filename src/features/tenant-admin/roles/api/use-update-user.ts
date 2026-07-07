import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "./update-user";
import type { UpdateUserPayload } from "./update-user";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserPayload }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
