"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectAuthRole,
  selectIsAuthenticated,
  selectTenantSubdomain,
} from "@/features/auth/store/auth-selectors";
import { setTenantSubdomain } from "@/features/auth/store/auth-slice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectAuthHydrated);
  const role = useAppSelector(selectAuthRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tenantSubdomain = useAppSelector(selectTenantSubdomain);

  return {
    hydrated,
    role,
    isAuthenticated,
    tenantSubdomain,
    rememberTenantSubdomain: (subdomain: string) => {
      dispatch(setTenantSubdomain(subdomain));
    },
  };
}
