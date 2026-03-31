import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../core/services/user.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="home-container">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2 class="welcome-title">Welcome back, {{ currentUser?.firstName }}! 👋</h2>
          <p class="welcome-subtitle">Here's what's happening today.</p>
        </div>
        <div class="welcome-date">{{ today | date:'fullDate' }}</div>
      </div>

      <div class="stats-grid">
        @for (card of statCards; track card.label) {
          <mat-card class="stat-card" (click)="navigate(card.route)">
            <div class="stat-icon" [style.background]="card.bgColor">
              <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </mat-card>
        }
      </div>

      <div class="quick-actions">
        <h3 class="section-title">Quick Actions</h3>
        <div class="actions-grid">
          <button mat-raised-button color="primary" (click)="navigate('/users/new')" class="action-btn">
            <mat-icon>person_add</mat-icon>
            New User
          </button>
          <button mat-raised-button color="accent" (click)="navigate('/bookings/new')" class="action-btn">
            <mat-icon>add_circle</mat-icon>
            New Booking
          </button>
          <button mat-stroked-button color="primary" (click)="navigate('/users')" class="action-btn">
            <mat-icon>people</mat-icon>
            View All Users
          </button>
          <button mat-stroked-button color="primary" (click)="navigate('/bookings')" class="action-btn">
            <mat-icon>event</mat-icon>
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { display: flex; flex-direction: column; gap: 32px; }
    .welcome-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--primary-900);
      padding: 32px 40px;
      border-radius: 12px;
      color: white;
      box-shadow: var(--shadow-md);
    }
    .welcome-title { margin: 0 0 8px; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
    .welcome-subtitle { margin: 0; color: #cbd5e1; font-size: 15px; } /* Slate 300 */
    .welcome-date { font-size: 14px; color: #94a3b8; font-weight: 500; } /* Slate 400 */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px !important;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-value { font-size: 32px; font-weight: 700; color: var(--text-main); line-height: 1.1; }
    .stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }
    .section-title {
      margin: 0 0 20px;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-main);
      letter-spacing: -0.01em;
    }
    .actions-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .action-btn {
      height: 48px;
      padding: 0 24px;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
  `],
})
export class HomeComponent implements OnInit {
  today = new Date();
  currentUser: import('../../core/models/auth.model').AuthUser | null = null;
  statCards: StatCard[] = [];

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.statCards = [
      {
        label: 'Total Users',
        value: this.userService.getTotalCount(),
        icon: 'people',
        color: 'var(--accent-600)',
        bgColor: 'var(--accent-50)',
        route: '/users',
      },
      {
        label: 'Active Users',
        value: this.userService.getActiveCount(),
        icon: 'person_check',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
        route: '/users',
      },
      {
        label: 'Total Bookings',
        value: this.bookingService.getTotalCount(),
        icon: 'event',
        color: 'var(--accent-600)',
        bgColor: 'var(--accent-50)',
        route: '/bookings',
      },
      {
        label: 'Confirmed',
        value: this.bookingService.getConfirmedCount(),
        icon: 'event_available',
        color: 'var(--success-text)',
        bgColor: 'var(--success-bg)',
        route: '/bookings',
      },
      {
        label: 'Pending',
        value: this.bookingService.getPendingCount(),
        icon: 'pending_actions',
        color: 'var(--warning-text)',
        bgColor: 'var(--warning-bg)',
        route: '/bookings',
      },
    ];
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
