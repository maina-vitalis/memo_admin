import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;

export const selectAuthRole = (state: RootState) => state.auth.role;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectSuperAdminAccessToken = (state: RootState) =>
  state.auth.superAdminToken;

export const selectTenantAccessToken = (state: RootState) => state.auth.tenantToken;

export const selectTenantSubdomain = (state: RootState) =>
  state.auth.tenantSubdomain;

export const selectSuperAdminProfile = (state: RootState) =>
  state.auth.superAdmin;

export const selectTenantUser = (state: RootState) => state.auth.tenantUser;

export const selectInstitution = (state: RootState) => state.auth.institution;

export const selectAccessToken = createSelector(
  [selectAuthRole, selectSuperAdminAccessToken, selectTenantAccessToken],
  (role, superAdminToken, tenantToken) => {
    if (role === "super-admin") return superAdminToken;
    if (role === "tenant-admin") return tenantToken;
    return null;
  },
);

export const selectIsAuthenticated = createSelector(
  [selectAuthRole, selectSuperAdminAccessToken, selectTenantAccessToken],
  (role, superAdminToken, tenantToken) => {
    if (role === "super-admin") return Boolean(superAdminToken);
    if (role === "tenant-admin") return Boolean(tenantToken);
    return false;
  },
);

export const selectIsSuperAdminAuthenticated = createSelector(
  [selectAuthRole, selectSuperAdminAccessToken],
  (role, token) => role === "super-admin" && Boolean(token),
);

export const selectIsTenantAdminAuthenticated = createSelector(
  [selectAuthRole, selectTenantAccessToken],
  (role, token) => role === "tenant-admin" && Boolean(token),
);

export const selectIsAuthLoading = createSelector(
  [selectAuthStatus],
  (status) => status === "loading",
);
