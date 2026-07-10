export type ProvisionUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber: string;
  departmentId?: string;
  phoneNumber?: string;
};

export type ProvisionUserResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  admissionNumber: string;
};

export type ProvisionedUser = ProvisionUserResult;
