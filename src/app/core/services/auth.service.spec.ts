import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

const mockRouter = { navigate: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start as not logged in when localStorage is empty', () => {
    expect(service.isLoggedIn).toBe(false);
    expect(service.currentUser).toBeNull();
  });

  it('should login with valid credentials (admin)', () => {
    const result = service.login({ username: 'admin', password: 'admin123' });
    expect(result).not.toBeNull();
    expect(result?.user.username).toBe('admin');
    expect(result?.user.role).toBe('admin');
    expect(service.isLoggedIn).toBe(true);
  });

  it('should login with valid credentials (manager)', () => {
    const result = service.login({ username: 'manager', password: 'manager123' });
    expect(result).not.toBeNull();
    expect(result?.user.role).toBe('manager');
  });

  it('should return null for invalid credentials', () => {
    const result = service.login({ username: 'admin', password: 'wrong' });
    expect(result).toBeNull();
    expect(service.isLoggedIn).toBe(false);
  });

  it('should persist auth to localStorage on login', () => {
    service.login({ username: 'admin', password: 'admin123' });
    const stored = localStorage.getItem('app_auth_user');
    expect(stored).not.toBeNull();
  });

  it('should clear localStorage and user on logout', () => {
    service.login({ username: 'admin', password: 'admin123' });
    service.logout();
    expect(service.isLoggedIn).toBe(false);
    expect(service.currentUser).toBeNull();
    expect(localStorage.getItem('app_auth_user')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should emit currentUser$ on login', (done) => {
    service.currentUser$.subscribe((user) => {
      if (user) {
        expect(user.username).toBe('user');
        done();
      }
    });
    service.login({ username: 'user', password: 'user123' });
  });
});
