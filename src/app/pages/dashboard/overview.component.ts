import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-overview',
  imports: [CommonModule],
  template: `
    <div class="dashboard-settings">
      <h2>Overview</h2>
      <pre>{{ getCurrentUser() }}</pre>
    </div>
  `,
})
export class DashboardOverviewComponent {
  authService = inject(AuthService);

  getCurrentUser() {
    try {
      return JSON.stringify(this.authService.getCurrentUser(), null, 2);
    } catch {
      return null;
    }
  }
}
