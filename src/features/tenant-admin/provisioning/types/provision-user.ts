export interface ProvisionedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  departmentId?: string;
  staffNumber?: string;
  phoneNumber?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
}
