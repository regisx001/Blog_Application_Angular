import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  authService = inject(AuthService);

  constructor() {}
}
