import { getSecondsUntilExpiry } from "@/features/auth/jwt";
import { Role } from "@/lib/rbac/role.enum";
import type { AuthState } from "@/features/auth/store/auth-slice";

const AUTH_KEY = "memo_auth";
const AUTH_COOKIE = "memo_auth";

function setAuthCookie(accessToken: string) {
  if (typeof document === "undefined") return;

  const maxAge = getSecondsUntilExpiry(accessToken);
  if (!maxAge || maxAge <= 0) {
    clearAuthCookie();
    return;
  }

  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

type PersistedAuthState = Pick<
  AuthState,
  | "id"
  | "email"
  | "role"
  | "institutionId"
  | "firstName"
  | "lastName"
  | "accessToken"
  | "institution"
>;

function readJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadAuthFromStorage(): PersistedAuthState | null {
  if (typeof window === "undefined") return null;

  const parsed = readJson<PersistedAuthState>(localStorage.getItem(AUTH_KEY));
  if (!parsed?.accessToken || !parsed.role) return null;
  if (!Object.values(Role).includes(parsed.role)) return null;

  return parsed;
}

export function saveAuthToStorage(state: PersistedAuthState) {
  if (typeof window === "undefined") return;

  if (!state.role || !state.accessToken) {
    clearAuthStorage();
    return;
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify({
    id: state.id,
    email: state.email,
    role: state.role,
    institutionId: state.institutionId,
    firstName: state.firstName,
    lastName: state.lastName,
    accessToken: state.accessToken,
    institution: state.institution,
  }));
  setAuthCookie(state.accessToken);
}

export function syncAuthCookieFromStorage() {
  const persisted = loadAuthFromStorage();
  if (persisted?.accessToken) {
    setAuthCookie(persisted.accessToken);
  } else {
    clearAuthCookie();
  }
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("memo_refresh_token");
  clearAuthCookie();
  // Clear legacy keys from old dual-auth system
  localStorage.removeItem("memo_auth_role");
  localStorage.removeItem("memo_super_admin_access_token");
  localStorage.removeItem("memo_tenant_access_token");
  localStorage.removeItem("memo_tenant_subdomain");
  localStorage.removeItem("memo_super_admin_profile");
  localStorage.removeItem("memo_tenant_profile");
  localStorage.removeItem("memo_institution_profile");
}