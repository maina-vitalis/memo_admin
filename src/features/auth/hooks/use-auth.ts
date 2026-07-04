"use client";

import { useAppSelector } from "@/store/hooks";
import {
  selectAuthHydrated,
  selectAuthRole,
  selectAuthUser,
  selectInstitution,
  selectIsAuthenticated,
  selectTenantSubdomain,
} from "@/features/auth/store/auth-selectors";

/** [AUTH] Read unified auth state from Redux. */
export function useAuth() {
  const hydrated = useAppSelector(selectAuthHydrated);
  const role = useAppSelector(selectAuthRole);
  const user = useAppSelector(selectAuthUser);
  const institution = useAppSelector(selectInstitution);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tenantSubdomain = useAppSelector(selectTenantSubdomain);

  return {
    hydrated,
    role,
    user,
    institution,
    isAuthenticated,
    tenantSubdomain,
  };
}