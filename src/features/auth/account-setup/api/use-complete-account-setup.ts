"use client";

import { useAppDispatch } from "@/store/hooks";
import { completeAccountSetup as completeAccountSetupRequest } from "@/features/auth/account-setup/api/complete-account-setup";
import { applyAuthSession } from "@/features/auth/store/auth-slice";
import type { CompleteAccountSetupInput } from "@/features/auth/account-setup/types/account-setup";

export function useCompleteAccountSetup() {
  const dispatch = useAppDispatch();

  return {
    mutateAsync: async (input: CompleteAccountSetupInput) => {
      const result = await completeAccountSetupRequest(input);
      dispatch(applyAuthSession(result));
      return result;
    },
  };
}
