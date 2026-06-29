import { tenantApi } from "../../shared/api/client";

export interface User {
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

export async function getUsers(): Promise<User[]> {
  return tenantApi<User[]>("/users", {
    method: "GET",
  });
}
