import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home.component';
import { UserService } from '../../core/services/user.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

const mockRouter = { navigate: jest.fn() };
const mockUserService = { getTotalCount: () => 8, getActiveCount: () => 6 };
const mockBookingService = {
  getTotalCount: () => 6,
  getConfirmedCount: () => 3,
  getPendingCount: () => 2,
};
const mockAuthService = {
  currentUser: { firstName: 'Admin', lastName: 'User' },
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: UserService, useValue: mockUserService },
        { provide: BookingService, useValue: mockBookingService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 5 stat cards', () => {
    expect(component.statCards.length).toBe(5);
  });

  it('should show correct total user count', () => {
    const totalCard = component.statCards.find((c) => c.label === 'Total Users');
    expect(totalCard?.value).toBe(8);
  });

  it('should show correct confirmed bookings count', () => {
    const confirmedCard = component.statCards.find((c) => c.label === 'Confirmed');
    expect(confirmedCard?.value).toBe(3);
  });

  it('should navigate on navigate()', () => {
    component.navigate('/users');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });
});
