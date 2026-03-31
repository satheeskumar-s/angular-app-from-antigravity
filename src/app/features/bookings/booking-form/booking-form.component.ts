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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <button mat-icon-button (click)="goBack()" style="color: var(--text-muted);"><mat-icon>arrow_back</mat-icon></button>
        <div>
          <h2 class="form-title">{{ isEdit ? 'Edit Booking' : 'New Booking' }}</h2>
          <p class="form-subtitle">{{ isEdit ? 'Update booking details' : 'Reserve a resource for your needs' }}</p>
        </div>
      </div>

      <mat-card class="form-card">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3 class="section-title">Booking Details</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="e.g. Team Meeting" id="booking-title"/>
              @if (f['title'].invalid && f['title'].touched) {
                <mat-error>Title is required</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Optional description" id="booking-description"></textarea>
            </mat-form-field>
          </div>

          <mat-divider />

          <div class="form-section">
            <h3 class="section-title">Resource</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Resource Type</mat-label>
                <mat-select formControlName="resourceType" id="resourceType">
                  <mat-option value="room">Room</mat-option>
                  <mat-option value="equipment">Equipment</mat-option>
                  <mat-option value="vehicle">Vehicle</mat-option>
                  <mat-option value="other">Other</mat-option>
                </mat-select>
                @if (f['resourceType'].invalid && f['resourceType'].touched) {
                  <mat-error>Resource type is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Resource Name</mat-label>
                <input matInput formControlName="resourceName" placeholder="e.g. Conference Room A" id="resourceName"/>
                @if (f['resourceName'].invalid && f['resourceName'].touched) {
                  <mat-error>Resource name is required</mat-error>
                }
              </mat-form-field>
            </div>
          </div>

          <mat-divider />

          <div class="form-section">
            <h3 class="section-title">Schedule</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate" id="startDate"/>
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"/>
                <mat-datepicker #startPicker/>
                @if (f['startDate'].invalid && f['startDate'].touched) {
                  <mat-error>Start date is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate" id="endDate"/>
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"/>
                <mat-datepicker #endPicker/>
                @if (f['endDate'].invalid && f['endDate'].touched) {
                  <mat-error>End date is required</mat-error>
                }
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status" id="booking-status">
                <mat-option value="pending">Pending</mat-option>
                <mat-option value="confirmed">Confirmed</mat-option>
                <mat-option value="cancelled">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput formControlName="notes" rows="2" placeholder="Any additional notes"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="goBack()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="bookingForm.invalid" id="submit-booking-btn">
              <mat-icon>{{ isEdit ? 'save' : 'add_circle' }}</mat-icon>
              {{ isEdit ? 'Update Booking' : 'Create Booking' }}
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 24px; max-width: 720px; }
    .form-header { display: flex; align-items: center; gap: 16px; }
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
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  isEdit = false;
  bookingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.bookingId;
    this.buildForm();

    if (this.isEdit && this.bookingId) {
      const booking = this.bookingService.getById(this.bookingId);
      if (booking) {
        this.bookingForm.patchValue(booking);
      } else {
        this.router.navigate(['/bookings']);
      }
    }
  }

  private buildForm(): void {
    const user = this.authService.currentUser;
    this.bookingForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      resourceType: ['room', [Validators.required]],
      resourceName: ['', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
      status: ['pending'],
      notes: [''],
      userId: [user?.id ?? ''],
      userName: [user ? `${user.firstName} ${user.lastName}` : ''],
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    if (this.isEdit && this.bookingId) {
      this.bookingService.update(this.bookingId, this.bookingForm.value);
      this.snackBar.open('Booking updated!', 'Close', { duration: 3000 });
    } else {
      this.bookingService.create(this.bookingForm.value);
      this.snackBar.open('Booking created!', 'Close', { duration: 3000 });
    }
    this.router.navigate(['/bookings']);
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }
}
