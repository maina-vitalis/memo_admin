"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/features/auth/store/auth-slice";
import { selectIsAuthLoading } from "@/features/auth/store/auth-selectors";
import type { LoginInput } from "@/features/auth/types";

export function useLogin() {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(selectIsAuthLoading);

  return {
    mutateAsync: (input: LoginInput) => dispatch(login(input)).unwrap(),
    isPending,
  };
}
