export type InstitutionPlan = "trial" | "basic" | "pro";

export interface Institution {
  id: string;
  name: string;
  subdomain: string;
  plan: InstitutionPlan;
  logoUrl: string | null;
  contactEmail: string;
  countryCode: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Principal {
  id: string;
  institutionId: string;
  roleId: string;
  firstName: string;
  lastName: string;
  email: string;
  mustChangePassword: boolean;
}

export interface PlatformLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface ProvisionInstitutionInput {
  name: string;
  subdomain: string;
  contactEmail: string;
  plan: InstitutionPlan;
  principalFirstName: string;
  principalLastName: string;
  principalEmail: string;
  principalPassword?: string;
}

export interface ProvisionInstitutionResponse {
  institution: Institution;
  principal: Principal;
  temporaryPassword?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string | string[];
}
