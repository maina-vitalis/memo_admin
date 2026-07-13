/**
 * [AUTH] auth-slice.ts
 *
 * Redux slice for authentication state.
 *
 * After BFF migration:
 * - `accessToken` is REMOVED from AuthState. It lives in the `memo_access`
 *   HttpOnly cookie set by the Next.js BFF — it is inaccessible to Redux.
 * - `refreshAccessToken` reducer is REMOVED — the BFF manages token rotation
 *   transparently via Set-Cookie headers; Redux does not need to track it.
 * - `syncAuthCookieFromStorage` is REMOVED — server owns the cookie now.
 * - Session "presence" is determined by `role + id` in Redux state.
 *   Actual validity is enforced by the backend on every API call.
 */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { login as loginRequest } from '@/features/auth/login/api/login';
import {
  clearAuthStorage,
  loadAuthFromStorage,
  saveAuthToStorage,
} from '@/features/auth/store/auth-persistence';
import type { AuthUser, InstitutionSummary, LoginInput, LoginResult } from '@/features/auth/types';
import { Role } from '@/lib/rbac/role.enum';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

/** [AUTH] Unified auth state — no raw token; role + id signal authenticated presence. */
export type AuthState = {
  id: string | null;
  email: string | null;
  role: Role | null;
  institutionId: string | null;
  firstName: string | null;
  lastName: string | null;
  institution: InstitutionSummary | null;
  status: AuthStatus;
  error: string | null;
  hydrated: boolean;
  // accessToken intentionally removed — lives in HttpOnly cookie (BFF-managed)
};

const initialState: AuthState = {
  id: null,
  email: null,
  role: null,
  institutionId: null,
  firstName: null,
  lastName: null,
  institution: null,
  status: 'idle',
  error: null,
  hydrated: false,
};

/** Apply the safe user profile from a login/session response into Redux state. */
function applyLoginResult(state: AuthState, result: LoginResult) {
  state.id = result.user.id;
  state.email = result.user.email;
  state.role = result.user.role;
  state.institutionId = result.user.institutionId;
  state.firstName = result.user.firstName;
  state.lastName = result.user.lastName;
  state.institution = result.institution ?? null;
  // No accessToken assignment — it lives in the HttpOnly cookie
}

export const login = createAsyncThunk<LoginResult, LoginInput, { rejectValue: string }>(
  'auth/login',
  async (input, { rejectWithValue }) => {
    try {
      return await loginRequest(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to sign in',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Rehydrate Redux from localStorage on app startup. */
    hydrateAuth(state) {
      const persisted = loadAuthFromStorage();

      if (persisted) {
        Object.assign(state, persisted);
        state.status = persisted.role ? 'authenticated' : 'idle';
        // No syncAuthCookieFromStorage — server manages the cookie
      }

      state.hydrated = true;
    },

    /** Log out — clear local state and trigger BFF cookie clearing. */
    logout(state) {
      // Fire-and-forget: BFF clears the HttpOnly cookies server-side.
      import('../auth-storage').then(({ serverLogout }) => {
        serverLogout().catch(() => {});
      });

      clearAuthStorage();
      Object.assign(state, { ...initialState, hydrated: true });
    },

    clearAuthError(state) {
      state.error = null;
      if (state.status === 'error') {
        state.status = state.role ? 'authenticated' : 'idle';
      }
    },

    /** Apply a successful login result (called after BFF login response). */
    applyAuthSession(state, action: PayloadAction<LoginResult>) {
      applyLoginResult(state, action.payload);
      state.status = 'authenticated';
      state.error = null;
      saveAuthToStorage(state);
    },

    /** Patch profile fields after a self-service profile update (e.g. Settings page). */
    updateProfileFields(
      state,
      action: PayloadAction<Partial<Pick<AuthState, 'firstName' | 'lastName'>>>,
    ) {
      Object.assign(state, action.payload);
      saveAuthToStorage(state);
    },

    /** Patch the institution summary after an institution profile update (tenant-admin Settings). */
    updateInstitutionSummary(
      state,
      action: PayloadAction<Partial<InstitutionSummary>>,
    ) {
      if (state.institution) {
        Object.assign(state.institution, action.payload);
        saveAuthToStorage(state);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        applyLoginResult(state, action.payload);
        state.status = 'authenticated';
        state.error = null;
        saveAuthToStorage(state);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Failed to sign in';
      });
  },
});

export const {
  hydrateAuth,
  logout,
  clearAuthError,
  applyAuthSession,
  updateProfileFields,
  updateInstitutionSummary,
} = authSlice.actions;

export const authReducer = authSlice.reducer;