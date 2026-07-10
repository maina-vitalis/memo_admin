"use client";

import { useMutation } from "@tanstack/react-query";
import { completeAccountSetup } from "@/features/auth/account-setup/api/complete-account-setup";
import type { CompleteAccountSetupInput } from "@/features/auth/account-setup/types/account-setup";

export function useCompleteAccountSetup() {
  return useMutation({
    mutationFn: (input: CompleteAccountSetupInput) => completeAccountSetup(input),
  });
}
