import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../models/booking.model';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Alice Johnson',
    title: 'Team Strategy Meeting',
    description: 'Quarterly planning session',
    resourceType: 'room',
    resourceName: 'Conference Room A',
    startDate: new Date('2026-03-20T09:00:00'),
    endDate: new Date('2026-03-20T11:00:00'),
    status: 'confirmed',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Bob Smith',
    title: 'Client Presentation Equipment',
    description: 'Projector and screen for client demo',
    resourceType: 'equipment',
    resourceName: 'Projector Set B',
    startDate: new Date('2026-03-21T14:00:00'),
    endDate: new Date('2026-03-21T17:00:00'),
    status: 'pending',
    createdAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Carol Williams',
    title: 'Site Visit Transport',
    description: 'Travel to client office',
    resourceType: 'vehicle',
    resourceName: 'Company Van 01',
    startDate: new Date('2026-03-22T08:00:00'),
    endDate: new Date('2026-03-22T18:00:00'),
    status: 'confirmed',
    createdAt: new Date('2026-03-11'),
    updatedAt: new Date('2026-03-11'),
  },
  {
    id: '4',
    userId: '4',
    userName: 'David Brown',
    title: 'Training Session',
    description: 'New employee onboarding training',
    resourceType: 'room',
    resourceName: 'Training Room 1',
    startDate: new Date('2026-03-25T10:00:00'),
    endDate: new Date('2026-03-25T12:00:00'),
    status: 'cancelled',
    createdAt: new Date('2026-03-13'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: '5',
    userId: '5',
    userName: 'Eve Davis',
    title: 'Product Demo',
    description: 'Demo setup for trade show',
    resourceType: 'equipment',
    resourceName: 'Demo Kit Alpha',
    startDate: new Date('2026-03-28T09:00:00'),
    endDate: new Date('2026-03-28T17:00:00'),
    status: 'pending',
    createdAt: new Date('2026-03-14'),
    updatedAt: new Date('2026-03-14'),
  },
  {
    id: '6',
    userId: '1',
    userName: 'Alice Johnson',
    title: 'All-hands Meeting',
    description: 'Monthly all-hands company meeting',
    resourceType: 'room',
    resourceName: 'Main Auditorium',
    startDate: new Date('2026-04-01T15:00:00'),
    endDate: new Date('2026-04-01T17:00:00'),
    status: 'confirmed',
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([...MOCK_BOOKINGS]);
  bookings$: Observable<Booking[]> = this.bookingsSubject.asObservable();

  private nextId = MOCK_BOOKINGS.length + 1;

  getAll(): Booking[] {
    return this.bookingsSubject.value;
  }

  getById(id: string): Booking | undefined {
    return this.bookingsSubject.value.find((b) => b.id === id);
  }

  create(dto: CreateBookingDto): Booking {
    const now = new Date();
    const booking: Booking = {
      ...dto,
      id: String(this.nextId++),
      createdAt: now,
      updatedAt: now,
    };
    this.bookingsSubject.next([...this.bookingsSubject.value, booking]);
    return booking;
  }

  update(id: string, dto: UpdateBookingDto): Booking | null {
    const bookings = this.bookingsSubject.value;
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    const updated = { ...bookings[idx], ...dto, updatedAt: new Date() };
    const newList = [...bookings];
    newList[idx] = updated;
    this.bookingsSubject.next(newList);
    return updated;
  }

  delete(id: string): boolean {
    const bookings = this.bookingsSubject.value;
    const filtered = bookings.filter((b) => b.id !== id);
    if (filtered.length === bookings.length) return false;
    this.bookingsSubject.next(filtered);
    return true;
  }

  getTotalCount(): number {
    return this.bookingsSubject.value.length;
  }

  getConfirmedCount(): number {
    return this.bookingsSubject.value.filter((b) => b.status === 'confirmed').length;
  }

  getPendingCount(): number {
    return this.bookingsSubject.value.filter((b) => b.status === 'pending').length;
  }
}
