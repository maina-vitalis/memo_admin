/**
 * [AUTH] auth-selectors.ts
 *
 * After BFF migration:
 * - `selectAccessToken` is REMOVED — token lives in an HttpOnly cookie, not Redux.
 * - `selectIsAuthenticated` and role-specific guards now check `role + id`.
 * - Deprecated selectors (selectSuperAdminAccessToken, selectTenantAccessToken)
 *   are fully removed.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { isSuperAdmin, isTenantAdminPortalRole } from '@/features/auth/types';

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

export const selectInstitution = (state: RootState) => state.auth.institution;

/** User is authenticated when we have their profile (role + id).
 *  Actual token validity is enforced server-side on every API request. */
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.role && state.auth.id);

export const selectIsAuthLoading = (state: RootState) =>
  state.auth.status === 'loading';

export const selectTenantSubdomain = (state: RootState) =>
  state.auth.institution?.subdomain ?? null;

export const selectIsSuperAdminAuthenticated = (state: RootState) =>
  Boolean(state.auth.id && isSuperAdmin(state.auth.role));

export const selectIsInstitutionAdminAuthenticated = (state: RootState) =>
  Boolean(state.auth.id && isTenantAdminPortalRole(state.auth.role));

export const selectIsTenantPortalAuthenticated = (state: RootState) =>
  selectIsInstitutionAdminAuthenticated(state);
