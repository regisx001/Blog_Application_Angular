import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private http = inject(HttpClient);
  private BACKEND_URL = environment.BACKEND_URL;

  private authService = inject(AuthService);
  constructor() {
    this.http.get(this.BACKEND_URL + '/users').subscribe((res: any) => {
      console.log(res);
    });
  }
}
