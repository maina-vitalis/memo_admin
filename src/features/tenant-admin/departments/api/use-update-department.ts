import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDepartment } from "./update-department";
import type { UpdateDepartmentPayload } from "./update-department";

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      data,
    }: {
      departmentId: string;
      data: UpdateDepartmentPayload;
    }) => updateDepartment(departmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
