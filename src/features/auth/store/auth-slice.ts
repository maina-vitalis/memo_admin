import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { login as loginRequest } from "@/features/auth/login/api/login";
import {
  clearAuthStorage,
  loadAuthFromStorage,
  saveAuthToStorage,
  syncAuthCookieFromStorage,
} from "@/features/auth/store/auth-persistence";
import type { AuthUser, InstitutionSummary, LoginInput, LoginResult } from "@/features/auth/types";
import { Role } from "@/lib/rbac/role.enum";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

/** [AUTH] Unified auth state — single token, role from fixed enum. */
export type AuthState = {
  id: string | null;
  email: string | null;
  role: Role | null;
  institutionId: string | null;
  firstName: string | null;
  lastName: string | null;
  accessToken: string | null;
  institution: InstitutionSummary | null;
  status: AuthStatus;
  error: string | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  id: null,
  email: null,
  role: null,
  institutionId: null,
  firstName: null,
  lastName: null,
  accessToken: null,
  institution: null,
  status: "idle",
  error: null,
  hydrated: false,
};

function applyLoginResult(state: AuthState, result: LoginResult) {
  state.id = result.user.id;
  state.email = result.user.email;
  state.role = result.user.role;
  state.institutionId = result.user.institutionId;
  state.firstName = result.user.firstName;
  state.lastName = result.user.lastName;
  state.accessToken = result.accessToken;
  state.institution = result.institution ?? null;
}

export const login = createAsyncThunk<
  LoginResult,
  LoginInput,
  { rejectValue: string }
>("auth/login", async (input, { rejectWithValue }) => {
  try {
    return await loginRequest(input);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to sign in",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      const persisted = loadAuthFromStorage();

      if (persisted) {
        Object.assign(state, persisted);
        state.status = persisted.role ? "authenticated" : "idle";
        syncAuthCookieFromStorage();
      }

      state.hydrated = true;
    },
    logout(state) {
      import("../auth-storage").then(({ serverLogout }) => {
        serverLogout().catch(() => {});
      });

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
    refreshAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
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

export const {
  hydrateAuth,
  logout,
  clearAuthError,
  applyAuthSession,
  refreshAccessToken,
} = authSlice.actions;

export const authReducer = authSlice.reducer;