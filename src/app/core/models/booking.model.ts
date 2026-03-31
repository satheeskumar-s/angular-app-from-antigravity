export interface Booking {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  resourceType: 'room' | 'equipment' | 'vehicle' | 'other';
  resourceName: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBookingDto = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookingDto = Partial<CreateBookingDto>;
