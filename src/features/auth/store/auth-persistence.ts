/**
 * [AUTH] auth-persistence.ts
 *
 * Manages non-sensitive auth state in localStorage for UI hydration on page load.
 *
 * After BFF migration:
 * - accessToken is INTENTIONALLY OMITTED from persisted state. It lives in
 *   the HttpOnly cookie managed by the Next.js BFF server-side.
 * - Client-side cookie helpers (setAuthCookie, clearAuthCookie,
 *   syncAuthCookieFromStorage) are REMOVED — the server owns the cookie now.
 * - A user is considered "known" (profile hydrated) if `role` exists in
 *   localStorage. Actual session validity is enforced by the backend via the
 *   HttpOnly cookie on every authenticated API request.
 */

import { Role } from '@/lib/rbac/role.enum';
import type { AuthState } from '@/features/auth/store/auth-slice';

const AUTH_KEY = 'memo_auth';

// Only non-sensitive profile data is persisted — never tokens.
type PersistedAuthState = Pick<
  AuthState,
  | 'id'
  | 'email'
  | 'role'
  | 'institutionId'
  | 'firstName'
  | 'lastName'
  | 'institution'
  // accessToken intentionally omitted — lives in HttpOnly cookie
>;

function readJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/** Load persisted user profile from localStorage for UI hydration.
 *  A user is "known" if role exists — actual session validity is
 *  enforced server-side by the HttpOnly cookie. */
export function loadAuthFromStorage(): PersistedAuthState | null {
  if (typeof window === 'undefined') return null;

  const parsed = readJson<PersistedAuthState>(localStorage.getItem(AUTH_KEY));

  // Role presence is the hydration signal — no accessToken check needed.
  if (!parsed?.role) return null;
  if (!Object.values(Role).includes(parsed.role)) return null;

  return parsed;
}

/** Persist non-sensitive user profile to localStorage for page-reload hydration. */
export function saveAuthToStorage(state: PersistedAuthState) {
  if (typeof window === 'undefined') return;

  if (!state.role) {
    clearAuthStorage();
    return;
  }

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      id: state.id,
      email: state.email,
      role: state.role,
      institutionId: state.institutionId,
      firstName: state.firstName,
      lastName: state.lastName,
      institution: state.institution,
      // accessToken intentionally omitted
    }),
  );
  // No cookie to set — the BFF server manages memo_access and memo_refresh.
}

/** Clear all persisted auth state including legacy keys from prior auth systems. */
export function clearAuthStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  // Clear legacy keys from old dual-auth / localStorage-token systems
  localStorage.removeItem('memo_refresh_token');
  localStorage.removeItem('memo_auth_role');
  localStorage.removeItem('memo_super_admin_access_token');
  localStorage.removeItem('memo_tenant_access_token');
  localStorage.removeItem('memo_tenant_subdomain');
  localStorage.removeItem('memo_super_admin_profile');
  localStorage.removeItem('memo_tenant_profile');
  localStorage.removeItem('memo_institution_profile');
}