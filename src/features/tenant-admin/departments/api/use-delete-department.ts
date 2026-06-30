import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "./delete-department";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (departmentId: string) => deleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
