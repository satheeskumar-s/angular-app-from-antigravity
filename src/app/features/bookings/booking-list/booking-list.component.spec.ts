import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { BookingListComponent } from './booking-list.component';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

const mockBookings: Booking[] = [
  {
    id: '1', userId: '1', userName: 'Alice', title: 'Meeting A', resourceType: 'room',
    resourceName: 'Room 1', startDate: new Date(), endDate: new Date(),
    status: 'confirmed', createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: '2', userId: '2', userName: 'Bob', title: 'Session B', resourceType: 'equipment',
    resourceName: 'Projector', startDate: new Date(), endDate: new Date(),
    status: 'pending', createdAt: new Date(), updatedAt: new Date(),
  },
];

const mockBookingService = {
  bookings$: of(mockBookings),
  delete: jest.fn().mockReturnValue(true),
};
const mockRouter = { navigate: jest.fn() };
const mockSnackBar = { open: jest.fn() };

describe('BookingListComponent', () => {
  let component: BookingListComponent;
  let fixture: ComponentFixture<BookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookingListComponent,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: BookingService, useValue: mockBookingService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load 2 bookings from service', () => {
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should have correct columns', () => {
    expect(component.displayedColumns).toContain('title');
    expect(component.displayedColumns).toContain('status');
    expect(component.displayedColumns).toContain('actions');
  });

  it('should apply filter', () => {
    component.searchValue = 'alice';
    component.applyFilter();
    expect(component.dataSource.filter).toBe('alice');
  });

  it('should clear search', () => {
    component.searchValue = 'x';
    component.clearSearch();
    expect(component.searchValue).toBe('');
    expect(component.dataSource.filter).toBe('');
  });

  it('should return correct resource icon', () => {
    expect(component.getResourceIcon('room')).toBe('meeting_room');
    expect(component.getResourceIcon('equipment')).toBe('computer');
    expect(component.getResourceIcon('vehicle')).toBe('directions_car');
    expect(component.getResourceIcon('other')).toBe('category');
    expect(component.getResourceIcon('unknown')).toBe('category');
  });

  it('should navigate to add booking', () => {
    component.navigateTo('/bookings/new');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bookings/new']);
  });
});
