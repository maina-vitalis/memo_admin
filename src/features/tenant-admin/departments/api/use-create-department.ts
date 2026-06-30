import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "./create-department";
import type { CreateDepartmentPayload } from "./create-department";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentPayload) => createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
