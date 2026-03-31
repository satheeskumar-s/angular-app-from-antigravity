import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
  ],
  template: `
    @if (user) {
      <div class="detail-container">
        <div class="detail-header">
          <button mat-icon-button (click)="goBack()"><mat-icon>arrow_back</mat-icon></button>
          <h2 class="detail-title">User Details</h2>
          <span class="spacer"></span>
          <button mat-stroked-button color="accent" (click)="navigateTo('/users/' + user.id + '/edit')">
            <mat-icon>edit</mat-icon> Edit
          </button>
        </div>

        <mat-card class="detail-card">
          <div class="user-profile">
            <div class="profile-avatar">{{ getInitials() }}</div>
            <div class="profile-info">
              <h3 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="profile-email">{{ user.email }}</p>
              <div class="profile-badges">
                <span class="status-chip status-{{ user.role }}">{{ user.role | titlecase }}</span>
                <span class="status-chip status-{{ user.status }}">{{ user.status | titlecase }}</span>
              </div>
            </div>
          </div>
          <mat-divider />
          <div class="detail-fields">
            <div class="field-row">
              <mat-icon class="field-icon">phone</mat-icon>
              <div class="field-data">
                <span class="field-label">Phone</span>
                <span class="field-value">{{ user.phone || 'Not provided' }}</span>
              </div>
            </div>
            <div class="field-row">
              <mat-icon class="field-icon">business</mat-icon>
              <div class="field-data">
                <span class="field-label">Department</span>
                <span class="field-value">{{ user.department || 'Not assigned' }}</span>
              </div>
            </div>
            <div class="field-row">
              <mat-icon class="field-icon">calendar_today</mat-icon>
              <div class="field-data">
                <span class="field-label">Member Since</span>
                <span class="field-value">{{ user.createdAt | date:'longDate' }}</span>
              </div>
            </div>
            <div class="field-row">
              <mat-icon class="field-icon">update</mat-icon>
              <div class="field-data">
                <span class="field-label">Last Updated</span>
                <span class="field-value">{{ user.updatedAt | date:'longDate' }}</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    } @else {
      <div class="not-found">
        <mat-icon>person_off</mat-icon>
        <p>User not found.</p>
        <button mat-raised-button color="primary" (click)="goBack()">Back to Users</button>
      </div>
    }
  `,
  styles: [`
    .detail-container { display: flex; flex-direction: column; gap: 24px; max-width: 600px; }
    .detail-header { display: flex; align-items: center; gap: 12px; }
    .detail-title { margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
    .spacer { flex: 1; }
    .detail-card { border-radius: 12px !important; overflow: hidden; padding: 0 !important; }
    .user-profile { display: flex; align-items: center; gap: 24px; padding: 32px 24px; background: var(--bg-surface); }
    .profile-avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background-color: var(--accent-600);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; flex-shrink: 0;
      letter-spacing: 0.05em;
    }
    .profile-info { display: flex; flex-direction: column; }
    .profile-name { margin: 0 0 4px; font-size: 22px; font-weight: 700; color: var(--text-main); letter-spacing: -0.01em; }
    .profile-email { margin: 0 0 12px; color: var(--text-muted); font-size: 14px; font-weight: 500; }
    .profile-badges { display: flex; gap: 8px; }
    /* Role and Status Chips are handled globally in styles.scss via .status-chip and .status-* classes */
    .detail-fields { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-row { display: flex; align-items: flex-start; gap: 16px; }
    .field-icon { color: var(--primary-600); flex-shrink: 0; font-size: 20px; width: 20px; height: 20px; margin-top: 2px; }
    .field-data { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .field-value { font-size: 15px; color: var(--text-main); font-weight: 500; }
    .not-found { text-align: center; padding: 64px; color: var(--text-muted); }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-dark); margin-bottom: 16px; }
  `],
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.user = this.userService.getById(id);
    }
  }

  getInitials(): string {
    if (!this.user) return '';
    return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
