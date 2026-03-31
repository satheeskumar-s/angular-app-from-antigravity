import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

const mockRouter = { navigate: jest.fn() };
const mockAuthService = {
  login: jest.fn(),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark controls touched and not call login on empty submit', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.loginForm.get('username')?.touched).toBe(true);
  });

  it('should be valid when username and password are filled', () => {
    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should navigate to /home on successful login', async () => {
    jest.useFakeTimers();
    mockAuthService.login.mockReturnValue({ user: { username: 'admin' }, token: 'tok' });
    component.loginForm.setValue({ username: 'admin', password: 'admin123' });
    component.onSubmit();
    jest.runAllTimers();
    expect(mockAuthService.login).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    jest.useRealTimers();
  });

  it('should set errorMessage on failed login', () => {
    jest.useFakeTimers();
    mockAuthService.login.mockReturnValue(null);
    component.loginForm.setValue({ username: 'admin', password: 'wrong' });
    component.onSubmit();
    jest.runAllTimers();
    expect(component.errorMessage).toBeTruthy();
    jest.useRealTimers();
  });

  it('should toggle showPassword', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = true;
    expect(component.showPassword).toBe(true);
  });
});
