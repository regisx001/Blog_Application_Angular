import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // ✅ SIMPLE: Just check current state (works with localStorage data)
  if (authService.isAuthenticated()) {
    return true;
  }

  console.log('AuthGuard: User not authenticated, redirecting to login');
  return router.createUrlTree(['/login']);
};
