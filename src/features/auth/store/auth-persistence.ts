import type { AuthRole } from "@/features/auth/types";
import type { AuthState } from "@/features/auth/store/auth-slice";

const ROLE_KEY = "memo_auth_role";
const SUPER_ADMIN_TOKEN_KEY = "memo_super_admin_access_token";
const TENANT_TOKEN_KEY = "memo_tenant_access_token";
const TENANT_SUBDOMAIN_KEY = "memo_tenant_subdomain";
const SUPER_ADMIN_PROFILE_KEY = "memo_super_admin_profile";
const TENANT_PROFILE_KEY = "memo_tenant_profile";
const INSTITUTION_PROFILE_KEY = "memo_institution_profile";

type PersistedAuthState = Pick<
  AuthState,
  | "role"
  | "superAdminToken"
  | "tenantToken"
  | "tenantSubdomain"
  | "superAdmin"
  | "tenantUser"
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

  const role = localStorage.getItem(ROLE_KEY);
  if (role !== "super-admin" && role !== "tenant-admin") {
    return null;
  }

  if (role === "super-admin") {
    const superAdminToken = localStorage.getItem(SUPER_ADMIN_TOKEN_KEY);
    if (!superAdminToken) return null;

    return {
      role,
      superAdminToken,
      tenantToken: null,
      tenantSubdomain: null,
      superAdmin: readJson(localStorage.getItem(SUPER_ADMIN_PROFILE_KEY)),
      tenantUser: null,
      institution: null,
    };
  }

  const tenantToken = localStorage.getItem(TENANT_TOKEN_KEY);
  const tenantSubdomain = localStorage.getItem(TENANT_SUBDOMAIN_KEY);
  if (!tenantToken || !tenantSubdomain) return null;

  return {
    role,
    superAdminToken: null,
    tenantToken,
    tenantSubdomain,
    superAdmin: null,
    tenantUser: readJson(localStorage.getItem(TENANT_PROFILE_KEY)),
    institution: readJson(localStorage.getItem(INSTITUTION_PROFILE_KEY)),
  };
}

export function saveAuthToStorage(state: PersistedAuthState) {
  if (typeof window === "undefined") return;

  if (!state.role) {
    clearAuthStorage();
    return;
  }

  localStorage.setItem(ROLE_KEY, state.role);

  if (state.role === "super-admin") {
    localStorage.setItem(SUPER_ADMIN_TOKEN_KEY, state.superAdminToken ?? "");
    localStorage.removeItem(TENANT_TOKEN_KEY);
    localStorage.removeItem(TENANT_SUBDOMAIN_KEY);
    localStorage.removeItem(TENANT_PROFILE_KEY);
    localStorage.removeItem(INSTITUTION_PROFILE_KEY);

    if (state.superAdmin) {
      localStorage.setItem(
        SUPER_ADMIN_PROFILE_KEY,
        JSON.stringify(state.superAdmin),
      );
    } else {
      localStorage.removeItem(SUPER_ADMIN_PROFILE_KEY);
    }

    return;
  }

  localStorage.setItem(TENANT_TOKEN_KEY, state.tenantToken ?? "");
  localStorage.setItem(TENANT_SUBDOMAIN_KEY, state.tenantSubdomain ?? "");
  localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
  localStorage.removeItem(SUPER_ADMIN_PROFILE_KEY);

  if (state.tenantUser) {
    localStorage.setItem(TENANT_PROFILE_KEY, JSON.stringify(state.tenantUser));
  } else {
    localStorage.removeItem(TENANT_PROFILE_KEY);
  }

  if (state.institution) {
    localStorage.setItem(
      INSTITUTION_PROFILE_KEY,
      JSON.stringify(state.institution),
    );
  } else {
    localStorage.removeItem(INSTITUTION_PROFILE_KEY);
  }
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
  localStorage.removeItem(TENANT_TOKEN_KEY);
  localStorage.removeItem(TENANT_SUBDOMAIN_KEY);
  localStorage.removeItem(SUPER_ADMIN_PROFILE_KEY);
  localStorage.removeItem(TENANT_PROFILE_KEY);
  localStorage.removeItem(INSTITUTION_PROFILE_KEY);
}

export type { AuthRole, PersistedAuthState };
