import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class LayoutComponent {
  authService = inject(AuthService);
  constructor() {}
}
