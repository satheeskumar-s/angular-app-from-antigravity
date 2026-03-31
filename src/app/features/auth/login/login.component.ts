import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-bg">
      <div class="login-container">
        <mat-card class="login-card">
          <div class="login-header">
            <div class="login-logo">
              <mat-icon class="logo-icon">dashboard</mat-icon>
            </div>
            <h1 class="login-title">AppPortal</h1>
            <p class="login-subtitle">Sign in to your account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            @if (errorMessage) {
              <div class="error-banner">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input
                matInput
                formControlName="username"
                placeholder="Enter username"
                id="username"
                autocomplete="username"
              />
              @if (f['username'].invalid && f['username'].touched) {
                <mat-error>Username is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input
                matInput
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter password"
                id="password"
                autocomplete="current-password"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="showPassword = !showPassword"
              >
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (f['password'].invalid && f['password'].touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="login-btn"
              [disabled]="isLoading"
              id="login-submit"
            >
              @if (isLoading) {
                <mat-spinner diameter="20" />
              } @else {
                Sign In
              }
            </button>
          </form>

          <div class="login-hint">
            <p><strong>Demo credentials:</strong></p>
            <p>admin / admin123</p>
            <p>manager / manager123</p>
            <p>user / user123</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .login-container { width: 100%; max-width: 420px; }
    .login-card {
      border-radius: 16px !important;
      padding: 40px 36px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.3) !important;
    }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-logo {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .logo-icon { color: #fff; font-size: 40px; width: 40px; height: 40px; }
    .login-title {
      margin: 0 0 4px;
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
    }
    .login-subtitle { margin: 0; color: #757575; font-size: 14px; }
    .login-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .login-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
      border-radius: 8px !important;
      background: linear-gradient(135deg, #1a237e, #3949ab) !important;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .login-hint {
      margin-top: 24px;
      padding: 12px 16px;
      background: #e8eaf6;
      border-radius: 8px;
      font-size: 13px;
      color: #3949ab;
    }
    .login-hint p { margin: 2px 0; }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      const result = this.authService.login(this.loginForm.value);
      this.isLoading = false;
      if (result) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    }, 600);
  }
}
