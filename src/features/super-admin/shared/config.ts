const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const superAdminConfig = {
  apiBaseUrl: API_BASE,
  useMock: false,
} as const;
