import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar class="app-header">
      <span class="page-title">{{ getPageTitle() }}</span>
      <span class="spacer"></span>
      @if (currentUser) {
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
          <div class="user-avatar">{{ getInitials() }}</div>
          <span class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="menu-user-info">
            <p class="menu-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
            <p class="menu-email">{{ currentUser.email }}</p>
            <p class="menu-role">{{ currentUser.role | titlecase }}</p>
          </div>
          <mat-divider />
          <button mat-menu-item (click)="navigateTo('/settings')">
            <mat-icon>settings</mat-icon>
            Settings
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </mat-menu>
      }
    </mat-toolbar>
  `,
  styles: [`
    .app-header {
      background: var(--bg-surface);
      color: var(--text-main);
      border-bottom: 1px solid var(--border-light);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 64px;
      padding: 0 40px;
    }
    .spacer { flex: 1; }
    .page-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }
    .user-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 16px 4px 8px;
      border-radius: 9999px;
      height: 40px;
      transition: background-color 0.2s;
    }
    .user-btn:hover {
      background-color: var(--bg-canvas);
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--accent-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .user-name {
      font-weight: 500;
      color: var(--text-main);
      font-size: 14px;
    }
    .menu-user-info {
      padding: 16px 20px;
      min-width: 200px;
    }
    .menu-name { margin: 0; font-weight: 600; font-size: 14px; color: var(--text-main); }
    .menu-email { margin: 4px 0 0; font-size: 13px; color: var(--text-muted); }
    .menu-role { 
      margin: 8px 0 0;
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent-600);
      background: var(--accent-50);
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `],
})
export class HeaderComponent implements OnInit {
  currentUser: AuthUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((u) => (this.currentUser = u));
  }

  getInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`.toUpperCase();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/home')) return 'Dashboard';
    if (url.includes('/users/new')) return 'New User';
    if (url.includes('/users') && url.includes('/edit')) return 'Edit User';
    if (url.match(/\/users\/\d+$/)) return 'User Details';
    if (url.includes('/users')) return 'Users';
    if (url.includes('/bookings/new')) return 'New Booking';
    if (url.includes('/bookings') && url.includes('/edit')) return 'Edit Booking';
    if (url.match(/\/bookings\/\d+$/)) return 'Booking Details';
    if (url.includes('/bookings')) return 'Bookings';
    if (url.includes('/settings')) return 'Settings';
    return 'AppPortal';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
