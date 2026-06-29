import { tenantApi } from "../../shared/api/client";

export interface UserInRole {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  departmentId?: string;
  staffNumber?: string;
  phoneNumber?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export async function getUsersForInstitution(): Promise<UserInRole[]> {
  return tenantApi<UserInRole[]>("/users", {
    method: "GET",
  });
}
