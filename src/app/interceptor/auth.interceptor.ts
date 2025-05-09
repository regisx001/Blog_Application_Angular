import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Skip refresh endpoint to avoid infinite loop
  if (req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  let clonedReq = req;

  // Add Authorization header if token exists
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle request and catch 401 errors to refresh token
  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        return authService.refreshToken().pipe(
          switchMap(({ accessToken }) => {
            authService.setAccessToken(accessToken);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            return next(retryReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
