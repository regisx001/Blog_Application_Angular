import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../core/auth/auth.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  imports: [TableModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private BACKEND_URL = environment.BACKEND_URL;

  data: any[] = [];
  error = null;
  private authService = inject(AuthService);

  ngOnInit() {
    this.http.get<{ content: any[] }>(this.BACKEND_URL + '/users').subscribe(
      (res) => {
        this.data = res?.content;
      },
      (error) => {
        if (error.error.status === 403) {
          this.error = error.error.message;
        }
        console.log(error.error);
      }
    );
  }

  stringity(data: any) {
    return JSON.stringify(data, null, 2);
  }

  timeAgo(dateStr: string): string {
    const now = new Date();
    const past = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return `${years} years ago`;
  }
}
