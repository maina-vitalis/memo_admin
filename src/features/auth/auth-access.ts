/**
 * [AUTH] auth-access.ts
 *
 * Synchronous accessors for auth state from outside React components.
 *
 * After BFF migration:
 * - getAccessToken(), getSuperAdminAccessToken(), getTenantAccessToken() are
 *   REMOVED. The access token lives in an HttpOnly cookie — JS cannot read it.
 * - Role and institution accessors are unchanged.
 */

import { getStore } from '@/store/store';
import {
  selectAuthRole,
  selectInstitution,
  selectIsAuthenticated,
  selectIsInstitutionAdminAuthenticated,
  selectIsSuperAdminAuthenticated,
  selectIsTenantPortalAuthenticated,
} from '@/features/auth/store/auth-selectors';

export function getAuthRole() {
  return selectAuthRole(getStore().getState());
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