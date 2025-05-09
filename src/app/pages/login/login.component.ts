import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
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
