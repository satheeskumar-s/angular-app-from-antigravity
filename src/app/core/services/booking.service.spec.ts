import { TestBed } from '@angular/core/testing';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [BookingService] });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 6 initial mock bookings', () => {
    expect(service.getAll().length).toBe(6);
  });

  it('should get booking by id', () => {
    const b = service.getById('1');
    expect(b).toBeDefined();
    expect(b?.title).toBe('Team Strategy Meeting');
  });

  it('should return undefined for non-existent id', () => {
    expect(service.getById('999')).toBeUndefined();
  });

  it('should return confirmed count correctly', () => {
    const confirmed = service.getConfirmedCount();
    expect(confirmed).toBeGreaterThan(0);
  });

  it('should return pending count correctly', () => {
    const pending = service.getPendingCount();
    expect(pending).toBeGreaterThan(0);
  });

  it('should create a new booking', () => {
    const countBefore = service.getTotalCount();
    const booking = service.create({
      userId: '1',
      userName: 'Test User',
      title: 'New Meeting',
      resourceType: 'room',
      resourceName: 'Room 101',
      startDate: new Date(),
      endDate: new Date(),
      status: 'pending',
    });
    expect(service.getTotalCount()).toBe(countBefore + 1);
    expect(booking.title).toBe('New Meeting');
  });

  it('should update an existing booking', () => {
    const updated = service.update('1', { status: 'cancelled' });
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('cancelled');
  });

  it('should return null when updating non-existent booking', () => {
    expect(service.update('999', { status: 'confirmed' })).toBeNull();
  });

  it('should delete a booking', () => {
    const countBefore = service.getTotalCount();
    const result = service.delete('1');
    expect(result).toBe(true);
    expect(service.getTotalCount()).toBe(countBefore - 1);
  });

  it('should return false when deleting non-existent booking', () => {
    expect(service.delete('999')).toBe(false);
  });
});
