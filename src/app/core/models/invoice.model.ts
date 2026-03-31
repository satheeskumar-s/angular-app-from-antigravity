export interface Invoice {
  id: string;
  bookingId?: string;
  customerName: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateInvoiceDto = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvoiceDto = Partial<CreateInvoiceDto>;
