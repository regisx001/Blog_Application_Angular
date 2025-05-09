import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-login',
  imports: [FormsModule, ButtonModule, RouterModule, InputTextModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  credentiels = {
    email: '',
    password: '',
  };

  onLogin() {
    this.authService.login(this.credentiels);
  }

  dataStringify() {
    return JSON.stringify(this.credentiels);
  }
}
