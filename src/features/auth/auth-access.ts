import { getStore } from "@/store/store";
import {
  selectAccessToken,
  selectAuthRole,
  selectInstitution,
  selectIsAuthenticated,
  selectIsInstitutionAdminAuthenticated,
  selectIsSuperAdminAuthenticated,
  selectIsTenantPortalAuthenticated,
} from "@/features/auth/store/auth-selectors";

export function getAuthRole() {
  return selectAuthRole(getStore().getState());
}

export function getAccessToken() {
  return selectAccessToken(getStore().getState());
}

/** @deprecated Use getAccessToken */
export function getSuperAdminAccessToken() {
  return getAccessToken();
}

/** @deprecated Use getAccessToken */
export function getTenantAccessToken() {
  return getAccessToken();
}

export function getTenantSubdomain() {
  return selectInstitution(getStore().getState())?.subdomain ?? null;
}

export function isAuthenticated() {
  return selectIsAuthenticated(getStore().getState());
}

export function isSuperAdminAuthenticated() {
  return selectIsSuperAdminAuthenticated(getStore().getState());
}

export function isTenantAdminAuthenticated() {
  return selectIsInstitutionAdminAuthenticated(getStore().getState());
}

export function isTenantPortalAuthenticated() {
  return selectIsTenantPortalAuthenticated(getStore().getState());
}