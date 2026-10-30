import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthStore } from '../store/auth.store';

/**
 * Attaches the admin JWT to requests targeting the portfolio-api backend, and
 * logs the user out (then redirects to login) when the API rejects the token.
 * Only requests to `adminApiUrl` are touched, so the public contact form and
 * i18n asset requests are left alone.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAdminApiRequest = req.url.startsWith(environment.adminApiUrl);
  const token = authStore.token();

  const authReq =
    isAdminApiRequest && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isAdminApiRequest && error.status === 401) {
        authStore.logout();
        void router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    }),
  );
};
