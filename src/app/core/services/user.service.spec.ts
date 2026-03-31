import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserService] });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 8 initial mock users', () => {
    expect(service.getAll().length).toBe(8);
  });

  it('should return active user count correctly', () => {
    const activeCount = service.getActiveCount();
    expect(activeCount).toBeGreaterThan(0);
    expect(activeCount).toBeLessThanOrEqual(service.getTotalCount());
  });

  it('should get user by id', () => {
    const user = service.getById('1');
    expect(user).toBeDefined();
    expect(user?.firstName).toBe('Alice');
  });

  it('should return undefined for non-existent id', () => {
    expect(service.getById('999')).toBeUndefined();
  });

  it('should create a new user and add to list', () => {
    const countBefore = service.getTotalCount();
    const newUser = service.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'user',
      status: 'active',
    });
    expect(service.getTotalCount()).toBe(countBefore + 1);
    expect(newUser.id).toBeDefined();
    expect(newUser.firstName).toBe('Test');
  });

  it('should update an existing user', () => {
    const updated = service.update('1', { firstName: 'Updated' });
    expect(updated).not.toBeNull();
    expect(updated?.firstName).toBe('Updated');
    expect(service.getById('1')?.firstName).toBe('Updated');
  });

  it('should return null when updating non-existent user', () => {
    expect(service.update('999', { firstName: 'X' })).toBeNull();
  });

  it('should delete a user and reduce count', () => {
    const countBefore = service.getTotalCount();
    const result = service.delete('1');
    expect(result).toBe(true);
    expect(service.getTotalCount()).toBe(countBefore - 1);
    expect(service.getById('1')).toBeUndefined();
  });

  it('should return false when deleting non-existent user', () => {
    expect(service.delete('999')).toBe(false);
  });

  it('should emit updated list via users$', (done) => {
    let callCount = 0;
    service.users$.subscribe((users) => {
      callCount++;
      if (callCount === 2) {
        expect(users.length).toBe(9);
        done();
      }
    });
    service.create({ firstName: 'New', lastName: 'Person', email: 'new@test.com', role: 'user', status: 'active' });
  });
});
