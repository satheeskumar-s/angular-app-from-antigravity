import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';
import { InvoiceFormComponent } from '../../invoices/invoice-form/invoice-form.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatDialogModule],
  template: `
    @if (booking) {
      <div class="detail-container">
        <div class="detail-header">
          <h2 class="detail-title">Booking Details</h2>
          <span class="spacer"></span>
          @if (isAdmin) {
            <button mat-stroked-button color="primary" (click)="openCreateInvoiceModal()" class="header-action-btn">
              <mat-icon>receipt_long</mat-icon> Create Invoice
            </button>
          }
          <button mat-stroked-button color="accent" (click)="navigateTo('/bookings/' + booking.id + '/edit')" class="header-action-btn">
            <mat-icon>edit</mat-icon> Edit
          </button>
        </div>

        <mat-card class="detail-card">
          <div class="booking-hero">
            <div class="resource-badge resource-{{ booking.resourceType }}">
              <mat-icon>{{ getResourceIcon(booking.resourceType) }}</mat-icon>
            </div>
            <div>
              <h3 class="booking-title">{{ booking.title }}</h3>
              <p class="booking-resource">{{ booking.resourceName }}</p>
              <span class="status-chip status-{{ booking.status }}">{{ booking.status | titlecase }}</span>
            </div>
          </div>

          <mat-divider />

          <div class="detail-fields">
            @if (booking.description) {
              <div class="field-row">
                <mat-icon class="field-icon">notes</mat-icon>
                <div class="field-data">
                  <span class="field-label">Description</span>
                  <span class="field-value">{{ booking.description }}</span>
                </div>
              </div>
            }
            <div class="field-row">
              <mat-icon class="field-icon">person</mat-icon>
              <div class="field-data">
                <span class="field-label">Booked By</span>
                <span class="field-value">{{ booking.userName }}</span>
              </div>
            </div>
            <div class="field-row">
              <mat-icon class="field-icon">event</mat-icon>
              <div class="field-data">
                <span class="field-label">Start</span>
                <span class="field-value">{{ booking.startDate | date:'full' }}</span>
              </div>
            </div>
            <div class="field-row">
              <mat-icon class="field-icon">event_busy</mat-icon>
              <div class="field-data">
                <span class="field-label">End</span>
                <span class="field-value">{{ booking.endDate | date:'full' }}</span>
              </div>
            </div>
            @if (booking.notes) {
              <div class="field-row">
                <mat-icon class="field-icon">comment</mat-icon>
                <div class="field-data">
                  <span class="field-label">Notes</span>
                  <span class="field-value">{{ booking.notes }}</span>
                </div>
              </div>
            }
            <div class="field-row">
              <mat-icon class="field-icon">schedule</mat-icon>
              <div class="field-data">
                <span class="field-label">Created</span>
                <span class="field-value">{{ booking.createdAt | date:'longDate' }}</span>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    } @else {
      <div class="not-found">
        <mat-icon>event_busy</mat-icon>
        <p>Booking not found.</p>
        <button mat-raised-button color="primary" (click)="goBack()">Back to Bookings</button>
      </div>
    }
  `,
  styles: [`
    .detail-container { display: flex; flex-direction: column; gap: 24px; max-width: 600px; }
    .detail-header { display: flex; align-items: center; gap: 12px; }
    .detail-title { margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
    .header-action-btn { margin-left: 8px; }
    .spacer { flex: 1; }
    .detail-card { border-radius: 12px !important; padding: 0 !important; overflow: hidden; }
    .booking-hero { display: flex; align-items: flex-start; gap: 20px; padding: 32px 24px; background: var(--bg-surface); }
    .resource-badge {
      width: 56px; height: 56px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .resource-room { background-color: var(--accent-50); color: var(--accent-600); }
    .resource-equipment { background-color: #f1f5f9; color: var(--primary-600); }
    .resource-vehicle { background-color: var(--warning-bg); color: var(--warning-text); }
    .resource-other { background-color: #f3e8ff; color: #9333ea; }
    .resource-badge mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .booking-title { margin: 0 0 6px; font-size: 22px; font-weight: 700; color: var(--text-main); letter-spacing: -0.01em; }
    .booking-resource { margin: 0 0 12px; color: var(--text-muted); font-size: 14px; font-weight: 500;}
    /* Status chips handled globally in styles.scss */
    .detail-fields { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-row { display: flex; align-items: flex-start; gap: 16px; }
    .field-icon { color: var(--primary-600); flex-shrink: 0; font-size: 20px; width: 20px; height: 20px; margin-top: 2px; }
    .field-data { display: flex; flex-direction: column; gap: 4px; }
    .field-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .field-value { font-size: 15px; color: var(--text-main); font-weight: 500; line-height: 1.4; }
    .not-found { text-align: center; padding: 64px; color: var(--text-muted); }
    .not-found mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--border-dark); margin-bottom: 16px; }
  `],
})
export class BookingDetailComponent implements OnInit {
  booking: Booking | undefined;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.currentUser?.role === 'admin';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.booking = this.bookingService.getById(id);
  }

  getResourceIcon(type: string): string {
    const map: Record<string, string> = {
      room: 'meeting_room', equipment: 'computer', vehicle: 'directions_car', other: 'category',
    };
    return map[type] ?? 'category';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  goBack(): void {
    this.router.navigate(['/bookings']);
  }

  openCreateInvoiceModal(): void {
    if (!this.booking) return;
    
    const dialogRef = this.dialog.open(InvoiceFormComponent, {
      width: '600px',
      data: {
        bookingId: this.booking.id,
        customerName: this.booking.userName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optional: Could redirect to invoices list or show success msg
        this.router.navigate(['/invoices']);
      }
    });
  }
}
