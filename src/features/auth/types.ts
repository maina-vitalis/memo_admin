export type AuthRole = "super-admin" | "tenant-admin";

export type LoginInput = {
  email: string;
  password: string;
};

export type SuperAdminLoginResult = {
  role: "super-admin";
  accessToken: string;
  refreshToken: string; // [REFRESH TOKENS] NEW
  tokenType: "Bearer";
  expiresIn: number; // seconds
  superAdmin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type TenantLoginResult = {
  role: "tenant-admin";
  accessToken: string;
  refreshToken: string; // [REFRESH TOKENS] NEW
  tokenType: "Bearer";
  expiresIn: number; // seconds (number) for short access token
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  institution: {
    id: string;
    name: string;
    subdomain: string;
  };
  mustChangePassword: boolean;
};

export type LoginResult = SuperAdminLoginResult | TenantLoginResult;

export function getPostLoginPath(role: AuthRole) {
  return role === "super-admin" ? "/super-admin" : "/admin";
}
