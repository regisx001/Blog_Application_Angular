import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `<router-outlet></router-outlet> `,
  styles: [],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  private destroy$ = new Subject<void>();
  currentUser: User | null = null;
  isAuthenticated = false;

  getCurrentUser(): User | null {
    try {
      return this.authService.getCurrentUser();
    } catch {
      return null;
    }
  }

  ngOnInit(): void {
    // Subscribe to reactive user data
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Subscribe to authentication state
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
