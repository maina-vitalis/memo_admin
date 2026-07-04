import { createSelector } from "@reduxjs/toolkit";

import { Role } from "@/lib/rbac/role.enum";
import type { RootState } from "@/store/store";
import { isInstitutionPortalRole, isSuperAdmin } from "@/features/auth/types";

export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectAuthUser = createSelector(
  [
    (state: RootState) => state.auth.id,
    (state: RootState) => state.auth.email,
    (state: RootState) => state.auth.role,
    (state: RootState) => state.auth.institutionId,
    (state: RootState) => state.auth.firstName,
    (state: RootState) => state.auth.lastName,
  ],
  (id, email, role, institutionId, firstName, lastName) => ({
    id,
    email,
    role,
    institutionId,
    firstName,
    lastName,
  }),
);
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectInstitution = (state: RootState) => state.auth.institution;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.role);
export const selectIsAuthLoading = (state: RootState) =>
  state.auth.status === "loading";
export const selectTenantSubdomain = (state: RootState) =>
  state.auth.institution?.subdomain ?? null;
export const selectIsSuperAdminAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && isSuperAdmin(state.auth.role));
export const selectIsInstitutionAdminAuthenticated = (state: RootState) =>
  Boolean(
    state.auth.accessToken &&
      isInstitutionPortalRole(state.auth.role) &&
      state.auth.role === Role.INSTITUTION_ADMIN,
  );
export const selectIsTenantPortalAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && isInstitutionPortalRole(state.auth.role));

/** @deprecated Use selectAccessToken */
export const selectSuperAdminAccessToken = selectAccessToken;
/** @deprecated Use selectAccessToken */
export const selectTenantAccessToken = selectAccessToken;