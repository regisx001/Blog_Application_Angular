import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private BACKEND_URL = environment.BACKEND_URL;
  data = {};

  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get(this.BACKEND_URL + '/users/me')
      // .pipe(tap((response) => console.log('User data:', response)))
      .subscribe({
        next: (userData) => {
          this.data = userData;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  getData() {
    return JSON.stringify(this.data, null, 1);
  }
}
