import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

const mockUser: User = {
  id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com',
  role: 'admin', status: 'active', createdAt: new Date(), updatedAt: new Date(),
};
const mockUserService = {
  getById: jest.fn().mockReturnValue(mockUser),
  create: jest.fn(),
  update: jest.fn(),
};
const mockRouter = { navigate: jest.fn() };
const mockSnackBar = { open: jest.fn() };

function createFixture(paramId: string | null) {
  return TestBed.configureTestingModule({
    imports: [UserFormComponent, NoopAnimationsModule],
    providers: [
      { provide: UserService, useValue: mockUserService },
      { provide: Router, useValue: mockRouter },
      { provide: MatSnackBar, useValue: mockSnackBar },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => paramId } } } },
    ],
  }).compileComponents();
}

describe('UserFormComponent — Create mode', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await createFixture(null);
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create in create mode', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should have invalid form initially', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('should be valid with all required fields', () => {
    component.userForm.patchValue({
      firstName: 'John', lastName: 'Doe', email: 'john@test.com', role: 'user', status: 'active',
    });
    expect(component.userForm.valid).toBeTruthy();
  });

  it('should call create on valid submit', () => {
    component.userForm.patchValue({
      firstName: 'John', lastName: 'Doe', email: 'john@test.com', role: 'user', status: 'active',
    });
    component.onSubmit();
    expect(mockUserService.create).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should not submit with invalid email', () => {
    component.userForm.patchValue({ firstName: 'J', lastName: 'D', email: 'bad-email', role: 'user', status: 'active' });
    component.onSubmit();
    expect(mockUserService.create).not.toHaveBeenCalled();
  });
});

describe('UserFormComponent — Edit mode', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await createFixture('1');
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create in edit mode', () => {
    expect(component.isEdit).toBe(true);
  });

  it('should prefill form with user data', () => {
    expect(component.userForm.get('firstName')?.value).toBe('Alice');
  });

  it('should call update on valid submit', () => {
    component.onSubmit();
    expect(mockUserService.update).toHaveBeenCalledWith('1', expect.any(Object));
  });
});
