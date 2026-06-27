export type SetupTokenDetails = {
  institutionName: string;
  subdomain: string;
  adminEmail: string;
  adminName: string;
  expiresAt: string;
};

export type CompleteAccountSetupInput = {
  token: string;
  password: string;
};
