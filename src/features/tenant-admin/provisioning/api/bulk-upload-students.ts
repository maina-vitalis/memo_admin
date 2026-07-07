import { tenantApi } from "../../shared/api/client";
import type { BulkUploadResult } from "../types/bulk-upload";

export async function bulkUploadStudents(
  file: File,
): Promise<BulkUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  return tenantApi<BulkUploadResult>("/users/bulk-upload", {
    method: "POST",
    body: formData,
  });
}
