export type SuperAdminProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type SuperAdminLoginResult = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  superAdmin: SuperAdminProfile;
};

export type SuperAdminLoginInput = {
  email: string;
  password: string;
};
