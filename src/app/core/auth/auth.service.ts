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

  // Reactive user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Initialize with stored user data on service creation
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const storedUser = this.tokenService.getUserInfo();
    const hasToken = !!this.tokenService.getAccessToken();

    if (storedUser && hasToken) {
      this.currentUserSubject.next(storedUser);
      this.isAuthenticatedSubject.next(true);
    }
  }

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
              // Update reactive state
              this.currentUserSubject.next(userInfo);
              this.isAuthenticatedSubject.next(true);
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
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  private clearAuthState(): void {
    this.tokenService.removeTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Method to update user data and reactive state
  updateUser(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.tokenService.setUserInfo(updatedUser);
      this.currentUserSubject.next(updatedUser);
    }
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.BACKEND_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.getAccessToken()}`,
      },
    });
  }

  // Method to refresh user data from server
  refreshUserInfo(): Observable<User> {
    return this.getUserInfo().pipe(
      tap((userInfo) => {
        this.tokenService.setUserInfo(userInfo);
        this.currentUserSubject.next(userInfo);
      })
    );
  }
}
