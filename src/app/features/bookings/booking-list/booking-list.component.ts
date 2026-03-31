import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="list-container">
      <div class="list-header">
        <div>
          <h2 class="list-title">Bookings</h2>
          <p class="list-subtitle">Manage all resource bookings</p>
        </div>
        <button mat-raised-button color="primary" (click)="navigateTo('/bookings/new')" id="add-booking-btn">
          <mat-icon>add_circle</mat-icon>
          Add Booking
        </button>
      </div>

      <mat-card class="table-card">
        <div class="table-toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search bookings</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [(ngModel)]="searchValue" (input)="applyFilter()" placeholder="Title, user, resource..."/>
            @if (searchValue) {
              <button mat-icon-button matSuffix (click)="clearSearch()"><mat-icon>close</mat-icon></button>
            }
          </mat-form-field>
        </div>

        <div class="table-wrapper">
          <table mat-table [dataSource]="dataSource" matSort class="bookings-table">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
              <td mat-cell *matCellDef="let b">
                <div class="booking-cell">
                  <div class="resource-icon" [class]="'resource-' + b.resourceType">
                    <mat-icon>{{ getResourceIcon(b.resourceType) }}</mat-icon>
                  </div>
                  <div>
                    <div class="booking-title">{{ b.title }}</div>
                    <div class="booking-resource">{{ b.resourceName }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Booked By</th>
              <td mat-cell *matCellDef="let b">{{ b.userName }}</td>
            </ng-container>

            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Start</th>
              <td mat-cell *matCellDef="let b">{{ b.startDate | date:'MMM d, y, h:mm a' }}</td>
            </ng-container>

            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>End</th>
              <td mat-cell *matCellDef="let b">{{ b.endDate | date:'MMM d, y, h:mm a' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let b">
                <span class="status-chip status-{{ b.status }}">{{ b.status | titlecase }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let b">
                <div class="actions-cell">
                  <button mat-icon-button color="primary" matTooltip="View" (click)="navigateTo('/bookings/' + b.id); $event.stopPropagation()"><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button color="accent" matTooltip="Edit" (click)="navigateTo('/bookings/' + b.id + '/edit'); $event.stopPropagation()"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteBooking(b); $event.stopPropagation()"><mat-icon>delete</mat-icon></button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row" (click)="navigateTo('/bookings/' + row.id)"></tr>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                <mat-icon>event_busy</mat-icon>
                <p>No bookings found</p>
              </td>
            </tr>
          </table>
        </div>
        <mat-paginator [pageSizeOptions]="[5, 10, 25]" [pageSize]="10" showFirstLastButtons />
      </mat-card>
    </div>
  `,
  styles: [`
    .list-container { display: flex; flex-direction: column; gap: 24px; }
    .list-header { display: flex; justify-content: space-between; align-items: center; }
    .list-title { margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
    .list-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
    .table-card { border-radius: 12px !important; overflow: hidden; padding: 0 !important; }
    .table-toolbar { padding: 16px 24px 0; background: var(--bg-surface); }
    .search-field { width: 100%; max-width: 360px; }
    .table-wrapper { overflow-x: auto; }
    .bookings-table { width: 100%; }
    .booking-cell { display: flex; align-items: center; gap: 12px; }
    .resource-icon {
      width: 36px; height: 36px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .resource-room { background-color: var(--accent-50); color: var(--accent-600); }
    .resource-equipment { background-color: #f1f5f9; color: var(--primary-600); } /* Slate 100 */
    .resource-vehicle { background-color: var(--warning-bg); color: var(--warning-text); }
    .resource-other { background-color: #f3e8ff; color: #9333ea; } /* Purple */
    .resource-icon mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .booking-title { font-weight: 600; font-size: 14px; color: var(--text-main); }
    .booking-resource { font-size: 13px; color: var(--text-muted); }
    /* Status chips are handled globally in styles.scss */
    .actions-cell { display: flex; gap: 8px; }
    .table-row { cursor: pointer; }
    .table-row:hover { background-color: #f1f5f9 !important; }
    .no-data-cell { text-align: center; padding: 48px; color: var(--text-muted); }
    .no-data-cell mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; color: var(--border-dark); }
  `],
})
export class BookingListComponent implements OnInit {
  displayedColumns = ['title', 'userName', 'startDate', 'endDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Booking>([]);
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingService.bookings$.subscribe((bookings) => {
      this.dataSource.data = bookings;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (b, filter) => {
      const s = filter.toLowerCase();
      return (
        b.title.toLowerCase().includes(s) ||
        b.userName.toLowerCase().includes(s) ||
        b.resourceName.toLowerCase().includes(s) ||
        b.status.toLowerCase().includes(s)
      );
    };
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  clearSearch(): void {
    this.searchValue = '';
    this.applyFilter();
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

  deleteBooking(booking: Booking): void {
    if (confirm(`Delete booking "${booking.title}"?`)) {
      this.bookingService.delete(booking.id);
      this.snackBar.open('Booking deleted.', 'Close', { duration: 3000 });
    }
  }
}
