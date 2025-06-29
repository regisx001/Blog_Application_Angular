import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    RippleModule,
    ReactiveFormsModule,
    CheckboxModule,
    PasswordModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');

  registerForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  async onSubmit() {
    debugger;
    console.log(this.registerForm.value);

    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const credentials = this.registerForm.value;
        this.isLoading.set(true);
        this.authService.register(credentials);
      } catch (error) {
        this.errorMessage.set('Invalid email or password. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.registerForm.markAllAsTouched();
    }
  }

  // Helper method to check if a field has specific error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.errors?.[errorType] && field?.touched);
  }

  // Helper method to check if field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
