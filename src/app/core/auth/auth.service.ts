import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BACKEND_URL = environment.BACKEND_URL;

  private http = inject(HttpClient);
  private router = inject(Router);

  // ✅ Reactive state with signals
  currentUser = signal<User | undefined>(undefined);
  isLoading = signal(false);

  async initializeAuth(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return;
    }

    this.isLoading.set(true);

    try {
      // ✅ Now this will work correctly
      const user = await this.fetchUserProfile().toPromise();

      this.currentUser.set(user);
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; refreshToken: string; expiresIn: number }>(
        `${this.BACKEND_URL}/auth/login`,
        credentials
      )
      .subscribe((res) => {
        this.saveTokens(res.accessToken, res.refreshToken);
        this.initializeAuth();
        this.router.navigate(['/dashboard/profile']);
      });
  }

  register(credentials: { email: string; username: string; password: string }) {
    return this.http
      .post<User>(`${this.BACKEND_URL}/auth/register`, credentials, {
        observe: 'response',
      })
      .subscribe((res) => {
        if (res.status === 201) {
          // this.login({
          //   email: credentials.email,
          //   password: credentials.password,
          // });
        }
      });
  }

  /**
   * ✅ FETCH USER PROFILE: Get user data from backend
   */
  fetchUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.BACKEND_URL}/auth/me`).pipe(
      tap((user) => {
        // console.log('Profile API response:', user);
        // console.log('✅ User data received:', user);
      }),
      catchError((error) => {
        // console.error('Profile fetch error:', error);
        throw error;
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.BACKEND_URL}/auth/refresh-token`,
      {
        refreshToken: this.getRefreshToken(),
      },
      { headers: {} }
    );
    // .subscribe((res) => {
    //   this.setAccessToken(res.accessToken);
    // });
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.currentUser.set(undefined);
  }
}
