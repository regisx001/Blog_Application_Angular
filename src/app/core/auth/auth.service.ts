import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse extends User {}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BACKEND_URL = environment.BACKEND_URL;

  http = inject(HttpClient);
  tokenService = inject(TokenService);
  router = inject(Router);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.BACKEND_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          // Store tokens
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);
          console.log('Login successful:', response);
        }),
        switchMap((response) => {
          return this.getUserInfo().pipe(
            tap((userInfo) => {
              // Store user info in localStorage
              this.tokenService.setUserInfo(userInfo);
              console.log('User info stored:', userInfo);
            }),
            map(() => response) // Return the original login response
          );
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(credentials: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.BACKEND_URL}/auth/register`,
      credentials
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.BACKEND_URL}/auth/refresh-token`,
      {
        refreshToken: this.tokenService.getRefreshToken(),
      },
      { headers: {} }
    );
  }

  logout(): void {
    this.tokenService.removeTokens();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  getCurrentUser(): User {
    return this.tokenService.getUserInfo();
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.BACKEND_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }

  constructor() {}
}
