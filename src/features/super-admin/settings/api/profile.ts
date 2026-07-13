import { apiRequest } from "@/lib/api/http";

export type ProfileUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: string;
  institutionId: string | null;
  avatarUrl: string | null;
};

export async function fetchMyProfile(): Promise<ProfileUser> {
  return apiRequest<ProfileUser>("/auth/me", { auth: true });
}

export type UpdateMyProfileInput = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export async function updateMyProfile(
  input: UpdateMyProfileInput,
): Promise<ProfileUser> {
  const formData = new FormData();
  if (input.firstName !== undefined) formData.append("firstName", input.firstName);
  if (input.lastName !== undefined) formData.append("lastName", input.lastName);
  if (input.phoneNumber !== undefined) formData.append("phoneNumber", input.phoneNumber);

  return apiRequest<ProfileUser>("/users/me", {
    method: "PATCH",
    body: formData,
    auth: true,
  });
}
