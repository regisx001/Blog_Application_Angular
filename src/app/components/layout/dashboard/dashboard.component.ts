import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `<router-outlet></router-outlet> `,
  styles: [],
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  sidebarOpen = false;

  getCurrentUser(): User | null {
    try {
      return this.authService.getCurrentUser();
    } catch {
      return null;
    }
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    const username = user?.username || 'User';
    return username.charAt(0).toUpperCase();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/overview')) return 'Dashboard Overview';
    // if (url.includes('/posts')) return 'My Posts';
    // if (url.includes('/analytics')) return 'Analytics';
    // if (url.includes('/comments')) return 'Comments';
    if (url.includes('/settings')) return 'Settings';
    return 'Dashboard';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
