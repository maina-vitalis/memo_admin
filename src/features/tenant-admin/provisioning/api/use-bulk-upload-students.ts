import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkUploadStudents } from "./bulk-upload-students";

export function useBulkUploadStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => bulkUploadStudents(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["institution-users"] });
    },
  });
}
