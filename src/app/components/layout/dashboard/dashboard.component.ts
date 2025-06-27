import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    PanelMenuModule,
    RouterLink,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardLayoutComponent implements OnInit {
  items: MenuItem[] = [];

  private router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Router',
        icon: 'pi pi-user-edit',
        route: '/dashboard',
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        route: '/dashboard/profile',
      },
    ];
  }
}
