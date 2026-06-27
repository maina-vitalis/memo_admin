"use client";

import { useQuery } from "@tanstack/react-query";
import { verifySetupToken } from "@/features/auth/account-setup/api/verify-setup-token";

export const accountSetupQueryKeys = {
  all: ["account-setup"] as const,
  verify: (token: string) => [...accountSetupQueryKeys.all, "verify", token] as const,
};

export function useVerifySetupToken(token: string | null) {
  return useQuery({
    queryKey: accountSetupQueryKeys.verify(token ?? ""),
    queryFn: () => verifySetupToken(token!),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });
}
