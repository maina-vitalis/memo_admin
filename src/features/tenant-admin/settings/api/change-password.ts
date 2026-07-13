import { tenantApi } from "@/features/tenant-admin/shared/api/client";

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function changeMyPassword(
  input: ChangePasswordInput,
): Promise<{ message?: string }> {
  return tenantApi("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
