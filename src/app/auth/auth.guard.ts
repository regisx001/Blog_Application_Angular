import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getAccessToken();
  const refreshToken = authService.getRefreshToken();

  if (token || refreshToken) {
    // Optionally: add logic to check if token is expired
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
