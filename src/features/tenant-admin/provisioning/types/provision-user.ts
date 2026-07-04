import { Role } from "@/lib/rbac/role.enum";

export interface ProvisionedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  departmentId?: string;
  staffNumber?: string;
  phoneNumber?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
}