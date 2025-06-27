import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  BACKEND_URL = environment.BACKEND_URL;
  user: any = {};

  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get(this.BACKEND_URL + '/auth/me')
      // .pipe(tap((response) => console.log('User data:', response)))
      .subscribe({
        next: (userData) => {
          this.user = userData;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  getData() {
    return JSON.stringify(this.user, null, 1);
  }
}
