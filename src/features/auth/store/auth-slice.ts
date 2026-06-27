import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { login as loginRequest } from "@/features/auth/login/api/login";
import {
  clearAuthStorage,
  loadAuthFromStorage,
  saveAuthToStorage,
} from "@/features/auth/store/auth-persistence";
import type {
  AuthRole,
  LoginInput,
  LoginResult,
  SuperAdminLoginResult,
  TenantLoginResult,
} from "@/features/auth/types";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export type AuthState = {
  role: AuthRole | null;
  superAdminToken: string | null;
  tenantToken: string | null;
  tenantSubdomain: string | null;
  superAdmin: SuperAdminLoginResult["superAdmin"] | null;
  tenantUser: TenantLoginResult["user"] | null;
  institution: TenantLoginResult["institution"] | null;
  status: AuthStatus;
  error: string | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  role: null,
  superAdminToken: null,
  tenantToken: null,
  tenantSubdomain: null,
  superAdmin: null,
  tenantUser: null,
  institution: null,
  status: "idle",
  error: null,
  hydrated: false,
};

function applyLoginResult(state: AuthState, result: LoginResult) {
  if (result.role === "super-admin") {
    state.role = "super-admin";
    state.superAdminToken = result.accessToken;
    state.superAdmin = result.superAdmin;
    state.tenantToken = null;
    state.tenantSubdomain = null;
    state.tenantUser = null;
    state.institution = null;
    return;
  }

  state.role = "tenant-admin";
  state.tenantToken = result.accessToken;
  state.tenantSubdomain = result.institution.subdomain;
  state.tenantUser = result.user;
  state.institution = result.institution;
  state.superAdminToken = null;
  state.superAdmin = null;
}

export const login = createAsyncThunk<LoginResult, LoginInput, { rejectValue: string }>(
  "auth/login",
  async (input, { rejectWithValue }) => {
    try {
      return await loginRequest(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to sign in",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      const persisted = loadAuthFromStorage();

      if (persisted) {
        state.role = persisted.role;
        state.superAdminToken = persisted.superAdminToken;
        state.tenantToken = persisted.tenantToken;
        state.tenantSubdomain = persisted.tenantSubdomain;
        state.superAdmin = persisted.superAdmin;
        state.tenantUser = persisted.tenantUser;
        state.institution = persisted.institution;
        state.status = persisted.role ? "authenticated" : "idle";
      }

      state.hydrated = true;
    },
    logout(state) {
      clearAuthStorage();
      Object.assign(state, { ...initialState, hydrated: true });
    },
    clearAuthError(state) {
      state.error = null;
      if (state.status === "error") {
        state.status = state.role ? "authenticated" : "idle";
      }
    },
    applyAuthSession(state, action: PayloadAction<LoginResult>) {
      applyLoginResult(state, action.payload);
      state.status = "authenticated";
      state.error = null;
      saveAuthToStorage(state);
    },
    setTenantSubdomain(state, action: PayloadAction<string>) {
      state.tenantSubdomain = action.payload;
      saveAuthToStorage(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        applyLoginResult(state, action.payload);
        state.status = "authenticated";
        state.error = null;
        saveAuthToStorage(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Failed to sign in";
      });
  },
});

export const { hydrateAuth, logout, clearAuthError, applyAuthSession, setTenantSubdomain } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
