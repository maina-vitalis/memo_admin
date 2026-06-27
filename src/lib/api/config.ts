export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMock: !process.env.NEXT_PUBLIC_API_URL,
} as const;
