import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { RouterModule } from '@angular/router';
// import { ChatbotComponent } from '../chatbot/chatbot.component';
@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    // ChatbotComponent,
    RouterModule,
    ButtonModule,
    MenubarModule,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  authService = inject(AuthService);

  constructor() {}
}
