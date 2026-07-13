"use client";

import { useMutation } from "@tanstack/react-query";
import {
  changeMyPassword,
  type ChangePasswordInput,
} from "@/features/super-admin/settings/api/change-password";

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changeMyPassword(input),
  });
}
