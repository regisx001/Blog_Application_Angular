import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private BACKEND_URL = environment.BACKEND_URL;

  data = [];
  private authService = inject(AuthService);

  ngOnInit() {
    this.http.get(this.BACKEND_URL + '/users').subscribe((res: any) => {
      // console.log(res?.content);
      this.data = res?.content;
    });
  }

  stringity(data: any) {
    return JSON.stringify(data, null, 2);
  }
}
