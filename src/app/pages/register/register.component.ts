import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    RippleModule,
    CheckboxModule,
    PasswordModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  credentiels = {
    email: '',
    password: '',
  };
  checked = false;

  onLogin() {
    this.authService.login(this.credentiels);
  }

  dataStringify() {
    return JSON.stringify(this.credentiels);
  }
}
