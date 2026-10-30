import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { LoginCredentials } from '../model/auth.model';

const TOKEN_STORAGE_KEY = 'portfolio.admin.token';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

/**
 * Owns the admin authentication session. Persists the JWT to localStorage so
 * the session survives reloads, and exposes an `isAuthenticated` signal that
 * the route guard and admin UI react to.
 *
 * Note: this is UX-level gating only. Every protected operation is enforced
 * server-side by the portfolio-api JWT guard.
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    isAuthenticated: computed(() => store.token() !== null),
  })),
  withMethods((store) => {
    const authService = inject(AuthService);

    function persistToken(token: string | null): void {
      try {
        if (token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, token);
        } else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } catch {
        // Storage may be unavailable (private mode); session stays in memory.
      }
    }

    return {
      login: rxMethod<LoginCredentials>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((credentials) =>
            authService.login(credentials).pipe(
              tapResponse({
                next: ({ accessToken }) => {
                  persistToken(accessToken);
                  patchState(store, { token: accessToken, loading: false });
                },
                error: (error: HttpErrorResponse) =>
                  patchState(store, {
                    loading: false,
                    error:
                      error.status === 401
                        ? 'Invalid email or password.'
                        : 'Unable to sign in. Please try again.',
                  }),
              }),
            ),
          ),
        ),
      ),
      logout(): void {
        persistToken(null);
        patchState(store, { token: null, error: null });
      },
      clearError(): void {
        patchState(store, { error: null });
      },
    };
  }),
  withHooks({
    onInit(store) {
      const token = readStoredToken();
      if (token) {
        patchState(store, { token });
      }
    },
  }),
);
