import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

const mockUsers: User[] = [
  {
    id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com',
    role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com',
    role: 'user', status: 'inactive', createdAt: new Date(), updatedAt: new Date(),
  },
];

const mockUserService = {
  users$: of(mockUsers),
  delete: jest.fn().mockReturnValue(true),
};
const mockRouter = { navigate: jest.fn() };
const mockSnackBar = { open: jest.fn() };

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        NoopAnimationsModule,
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
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users from service', () => {
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should display correct columns', () => {
    expect(component.displayedColumns).toContain('name');
    expect(component.displayedColumns).toContain('role');
    expect(component.displayedColumns).toContain('status');
    expect(component.displayedColumns).toContain('actions');
  });

  it('should navigate on navigateTo()', () => {
    component.navigateTo('/users/new');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/new']);
  });

  it('should apply filter and reset paginator', () => {
    component.searchValue = 'alice';
    component.applyFilter();
    expect(component.dataSource.filter).toBe('alice');
  });

  it('should clear search and reset filter', () => {
    component.searchValue = 'test';
    component.clearSearch();
    expect(component.searchValue).toBe('');
    expect(component.dataSource.filter).toBe('');
  });

  it('should return correct initials', () => {
    expect(component.getInitials(mockUsers[0])).toBe('AS');
    expect(component.getInitials(mockUsers[1])).toBe('BJ');
  });
});
