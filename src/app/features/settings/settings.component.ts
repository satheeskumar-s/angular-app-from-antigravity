import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h2 class="settings-title">Settings</h2>
        <p class="settings-subtitle">Manage your profile and preferences</p>
      </div>

      <div class="settings-grid">
        <mat-card class="settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">person</mat-icon>
            <h3 class="card-title">Profile Information</h3>
          </div>
          <mat-divider />
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="settings-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" id="settings-firstName"/>
                @if (profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" id="settings-lastName"/>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" id="settings-email"/>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role</mat-label>
              <input matInput formControlName="role" readonly class="readonly-field"/>
              <mat-hint>Role cannot be changed here</mat-hint>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid" id="save-profile-btn">
              <mat-icon>save</mat-icon> Save Profile
            </button>
          </form>
        </mat-card>

        <mat-card class="settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">palette</mat-icon>
            <h3 class="card-title">Preferences</h3>
          </div>
          <mat-divider />
          <div class="preferences-list">
            <div class="pref-row">
              <div class="pref-info">
                <p class="pref-label">Dark Mode</p>
                <p class="pref-desc">Toggle app dark theme (coming soon)</p>
              </div>
              <mat-slide-toggle [(ngModel)]="darkMode" color="primary" id="dark-mode-toggle" disabled />
            </div>
            <mat-divider />
            <div class="pref-row">
              <div class="pref-info">
                <p class="pref-label">Email Notifications</p>
                <p class="pref-desc">Receive booking confirmation emails</p>
              </div>
              <mat-slide-toggle [(ngModel)]="emailNotifications" color="primary" id="email-notifications-toggle" />
            </div>
            <mat-divider />
            <div class="pref-row">
              <div class="pref-info">
                <p class="pref-label">Compact View</p>
                <p class="pref-desc">Display tables in compact mode</p>
              </div>
              <mat-slide-toggle [(ngModel)]="compactView" color="primary" id="compact-view-toggle" />
            </div>
          </div>
          <div class="pref-actions">
            <button mat-raised-button color="primary" (click)="savePreferences()" id="save-prefs-btn">
              <mat-icon>check</mat-icon> Save Preferences
            </button>
          </div>
        </mat-card>

        <mat-card class="settings-card danger-card">
          <div class="card-header">
            <mat-icon class="card-icon danger-icon">security</mat-icon>
            <h3 class="card-title">Account</h3>
          </div>
          <mat-divider />
          <div class="account-actions">
            <div class="account-row">
              <div>
                <p class="pref-label">Sign Out</p>
                <p class="pref-desc">Sign out of your current session</p>
              </div>
              <button mat-stroked-button color="warn" (click)="logout()" id="logout-btn">
                <mat-icon>logout</mat-icon> Sign Out
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { display: flex; flex-direction: column; gap: 24px; max-width: 900px; }
    .settings-header {}
    .settings-title { margin: 0; font-size: 22px; font-weight: 700; color: #1a237e; }
    .settings-subtitle { margin: 4px 0 0; color: #757575; font-size: 13px; }
    .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
    .settings-card { border-radius: 12px !important; }
    .card-header { display: flex; align-items: center; gap: 12px; padding: 20px 20px 12px; }
    .card-icon { color: #3949ab; }
    .danger-icon { color: #e53935; }
    .card-title { margin: 0; font-size: 16px; font-weight: 600; color: #1a237e; }
    .settings-form { display: flex; flex-direction: column; gap: 4px; padding: 20px; }
    .form-row { display: flex; gap: 16px; }
    .full-width { width: 100%; }
    .half-width { flex: 1; }
    .readonly-field { color: #9e9e9e; }
    .preferences-list { padding: 8px 0; }
    .pref-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; }
    .pref-label { margin: 0 0 2px; font-weight: 500; font-size: 14px; color: #333; }
    .pref-desc { margin: 0; font-size: 12px; color: #9e9e9e; }
    .pref-actions { padding: 16px 20px 20px; }
    .account-actions { padding: 8px 0; }
    .account-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; }
    .danger-card { border: 1px solid #ffcdd2; }
  `],
})
export class SettingsComponent implements OnInit {
  profileForm!: FormGroup;
  darkMode = false;
  emailNotifications = true;
  compactView = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.profileForm = this.fb.group({
      firstName: [user?.firstName ?? '', [Validators.required]],
      lastName: [user?.lastName ?? ''],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      role: [{ value: user?.role ?? '', disabled: true }],
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.snackBar.open('Profile saved successfully!', 'Close', { duration: 3000 });
    }
  }

  savePreferences(): void {
    this.snackBar.open('Preferences saved!', 'Close', { duration: 3000 });
  }

  logout(): void {
    this.authService.logout();
  }
}
