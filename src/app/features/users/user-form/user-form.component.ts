import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button mat-icon-button (click)="goBack()" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h2 class="form-title">{{ isEdit ? 'Edit User' : 'Create User' }}</h2>
          <p class="form-subtitle">{{ isEdit ? 'Update user information' : 'Fill in the details to create a new user' }}</p>
        </div>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3 class="section-title">Personal Information</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="John" id="firstName"/>
                @if (f['firstName'].invalid && f['firstName'].touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Doe" id="lastName"/>
                @if (f['lastName'].invalid && f['lastName'].touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="john@example.com" id="email"/>
              @if (f['email'].errors?.['required'] && f['email'].touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (f['email'].errors?.['email'] && f['email'].touched) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone</mat-label>
              <mat-icon matPrefix>phone</mat-icon>
              <input matInput formControlName="phone" placeholder="+1-555-0100" id="phone"/>
            </mat-form-field>
          </div>

          <mat-divider />

          <div class="form-section">
            <h3 class="section-title">Role & Department</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Role</mat-label>
                <mat-select formControlName="role" id="role">
                  <mat-option value="admin">Admin</mat-option>
                  <mat-option value="manager">Manager</mat-option>
                  <mat-option value="user">User</mat-option>
                </mat-select>
                @if (f['role'].invalid && f['role'].touched) {
                  <mat-error>Role is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" id="status">
                  <mat-option value="active">Active</mat-option>
                  <mat-option value="inactive">Inactive</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department</mat-label>
              <mat-icon matPrefix>business</mat-icon>
              <input matInput formControlName="department" placeholder="Engineering" id="department"/>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="goBack()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid" id="submit-btn">
              <mat-icon>{{ isEdit ? 'save' : 'person_add' }}</mat-icon>
              {{ isEdit ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 24px; max-width: 720px; }
    .form-header { display: flex; align-items: center; gap: 16px; }
    .back-btn { color: var(--text-muted); }
    .back-btn:hover { color: var(--text-main); background: var(--bg-canvas); }
    .form-title { margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
    .form-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
    .form-card { border-radius: 12px !important; padding: 24px !important; }
    .form-section { padding: 0 0 24px; }
    .section-title { margin: 0 0 20px; font-size: 16px; font-weight: 600; color: var(--text-main); }
    .form-row { display: flex; gap: 20px; }
    .full-width { width: 100%; }
    .half-width { flex: 1; min-width: 200px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 16px; padding-top: 24px; }
  `],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.userId;
    this.buildForm();

    if (this.isEdit && this.userId) {
      const user = this.userService.getById(this.userId);
      if (user) {
        this.userForm.patchValue(user);
      } else {
        this.router.navigate(['/users']);
      }
    }
  }

  private buildForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['user', [Validators.required]],
      status: ['active', [Validators.required]],
      department: [''],
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.isEdit && this.userId) {
      this.userService.update(this.userId, this.userForm.value);
      this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
    } else {
      this.userService.create(this.userForm.value);
      this.snackBar.open('User created successfully!', 'Close', { duration: 3000 });
    }
    this.router.navigate(['/users']);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
