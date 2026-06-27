import {getStore} from "@/store/store";
import {
    selectAuthRole,
    selectIsAuthenticated,
    selectIsSuperAdminAuthenticated,
    selectIsTenantAdminAuthenticated,
    selectSuperAdminAccessToken,
    selectTenantAccessToken,
    selectTenantSubdomain,
} from "@/features/auth/store/auth-selectors";

export function getAuthRole() {
    return selectAuthRole(getStore().getState());
}

export function getSuperAdminAccessToken() {
    return selectSuperAdminAccessToken(getStore().getState());
}

export function getTenantAccessToken() {
    return selectTenantAccessToken(getStore().getState());
}

export function getAccessToken() {
    const state = getStore().getState();
    const role = selectAuthRole(state);

    if (role === "super-admin") {
        return selectSuperAdminAccessToken(state);
    }

    if (role === "tenant-admin") {
        return selectTenantAccessToken(state);
    }

    return null;
}

export function getTenantSubdomain() {
    return selectTenantSubdomain(getStore().getState());
}

export function isAuthenticated() {
    return selectIsAuthenticated(getStore().getState());
}

export function isSuperAdminAuthenticated() {
    return selectIsSuperAdminAuthenticated(getStore().getState());
}

export function isTenantAdminAuthenticated() {
    return selectIsTenantAdminAuthenticated(getStore().getState());
}
