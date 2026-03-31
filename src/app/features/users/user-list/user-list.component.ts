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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
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
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="list-container">
      <div class="list-header">
        <div>
          <h2 class="list-title">Users</h2>
          <p class="list-subtitle">Manage all users in the system</p>
        </div>
        <button mat-raised-button color="primary" (click)="navigateTo('/users/new')" id="add-user-btn">
          <mat-icon>person_add</mat-icon>
          Add User
        </button>
      </div>

      <mat-card class="table-card">
        <div class="table-toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search users</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [(ngModel)]="searchValue" (input)="applyFilter()" placeholder="Name, email, role..."/>
            @if (searchValue) {
              <button mat-icon-button matSuffix (click)="clearSearch()"><mat-icon>close</mat-icon></button>
            }
          </mat-form-field>
        </div>

        <div class="table-wrapper">
          <table mat-table [dataSource]="dataSource" matSort class="users-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let user">
                <div class="user-cell">
                  <div class="user-avatar-sm">{{ getInitials(user) }}</div>
                  <div>
                    <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
              <td mat-cell *matCellDef="let user">
                <span class="status-chip" [class]="'status-' + user.role">{{ user.role | titlecase }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
              <td mat-cell *matCellDef="let user">{{ user.department || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let user">
                <span class="status-chip" [class]="'status-' + user.status">{{ user.status | titlecase }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
              <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'mediumDate' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <div class="actions-cell">
                  <button mat-icon-button color="primary" matTooltip="View" (click)="navigateTo('/users/' + user.id)"><mat-icon>visibility</mat-icon></button>
                  <button mat-icon-button color="accent" matTooltip="Edit" (click)="navigateTo('/users/' + user.id + '/edit')"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteUser(user)"><mat-icon>delete</mat-icon></button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row" (click)="navigateTo('/users/' + row.id)"></tr>

            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                <mat-icon>people_outline</mat-icon>
                <p>No users found</p>
              </td>
            </tr>
          </table>
        </div>

        <mat-paginator
          [pageSizeOptions]="[5, 10, 25]"
          [pageSize]="10"
          showFirstLastButtons
        />
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
    .users-table { width: 100%; }
    .user-cell { display: flex; align-items: center; gap: 12px; }
    .user-avatar-sm {
      width: 36px; height: 36px; border-radius: 50%;
      background-color: var(--accent-600);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 600; flex-shrink: 0;
      letter-spacing: 0.05em;
    }
    .user-name { font-weight: 600; font-size: 14px; color: var(--text-main); }
    .user-email { font-size: 13px; color: var(--text-muted); }
    /* Role and Status Chips are handled globally in styles.scss via .status-chip and .status-* classes */
    .actions-cell { display: flex; gap: 8px; }
    .table-row { cursor: pointer; }
    .table-row:hover { background-color: #f1f5f9 !important; }
    .no-data-cell { text-align: center; padding: 48px; color: var(--text-muted); }
    .no-data-cell mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; color: var(--border-dark); }
  `],
})
export class UserListComponent implements OnInit {
  displayedColumns = ['name', 'role', 'department', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((users) => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (user, filter) => {
      const s = filter.toLowerCase();
      return (
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s) ||
        user.role.toLowerCase().includes(s) ||
        (user.department ?? '').toLowerCase().includes(s)
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

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  deleteUser(user: User): void {
    if (confirm(`Delete user "${user.firstName} ${user.lastName}"?`)) {
      this.userService.delete(user.id);
      this.snackBar.open('User deleted.', 'Close', { duration: 3000 });
    }
  }
}
