import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-verify',
  imports: [InputOtpModule, ButtonModule, CommonModule, FormsModule],
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  private BACKEND_URL = environment.BACKEND_URL;

  authService = inject(AuthService);
  http = inject(HttpClient);
  value = undefined;

  verifyAccount() {
    return this.http
      .post(this.BACKEND_URL + '/auth/verify', {
        email: this.authService.currentUser()?.email,
        verificationCode: this.value,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
