import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/home' } as RouterStateSnapshot;
  const mockRouter = { navigate: jest.fn(), createUrlTree: jest.fn((path) => path) };

  const runGuard = () => TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return true when user is logged in', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AuthService,
          useValue: { isLoggedIn: true },
        },
      ],
    });
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /login when user is not logged in', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: AuthService,
          useValue: { isLoggedIn: false },
        },
      ],
    });
    runGuard();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
