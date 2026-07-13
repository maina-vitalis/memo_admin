import { apiRequest } from "@/lib/api/http";

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export async function changeMyPassword(
  input: ChangePasswordInput,
): Promise<{ message?: string }> {
  return apiRequest("/auth/change-password", {
    method: "POST",
    body: input,
    auth: true,
  });
}
