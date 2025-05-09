import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BACKEND_URL = environment.BACKEND_URL;

  private http = inject(HttpClient);
  private router = inject(Router);

  login(credentials: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string; refreshToken: string; expiresIn: number }>(
        `${this.BACKEND_URL}/auth/login`,
        credentials
      )
      .subscribe((res) => {
        this.saveTokens(res.accessToken, res.refreshToken);
        this.router.navigate(['/dashboard']);
      });
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
  }
}
