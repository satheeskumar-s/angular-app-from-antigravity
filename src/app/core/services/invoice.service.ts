import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private mockInvoices: Invoice[] = [
    {
      id: '1',
      bookingId: '1',
      customerName: 'Alice Johnson',
      amount: 150.00,
      dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      bookingId: '2',
      customerName: 'Bob Smith',
      amount: 450.00,
      dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'overdue',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      bookingId: '3',
      customerName: 'Carol Williams',
      amount: 1200.00,
      dueDate: new Date(Date.now() - 86400000 * 10), // 10 days ago
      status: 'paid',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private invoicesSubject = new BehaviorSubject<Invoice[]>([...this.mockInvoices]);
  public invoices$ = this.invoicesSubject.asObservable();

  constructor() {}

  getAll(): Invoice[] {
    return this.invoicesSubject.getValue();
  }

  getById(id: string): Invoice | undefined {
    return this.getAll().find(i => i.id === id);
  }

  getByBookingId(bookingId: string): Invoice[] {
    return this.getAll().filter(i => i.bookingId === bookingId);
  }

  create(dto: CreateInvoiceDto): Invoice {
    const newInvoice: Invoice = {
      ...dto,
      id: (this.getAll().length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const current = this.getAll();
    this.invoicesSubject.next([...current, newInvoice]);
    return newInvoice;
  }

  update(id: string, dto: UpdateInvoiceDto): Invoice | null {
    const current = this.getAll();
    const index = current.findIndex(i => i.id === id);
    
    if (index === -1) return null;
    
    const updatedInvoice = {
      ...current[index],
      ...dto,
      updatedAt: new Date()
    };
    
    const newArray = [...current];
    newArray[index] = updatedInvoice;
    this.invoicesSubject.next(newArray);
    
    return updatedInvoice;
  }

  delete(id: string): boolean {
    const current = this.getAll();
    const filtered = current.filter(i => i.id !== id);
    if (filtered.length === current.length) return false;
    
    this.invoicesSubject.next(filtered);
    return true;
  }

  getTotalCount(): number {
    return this.getAll().length;
  }

  getPendingCount(): number {
    return this.getAll().filter(i => i.status === 'pending').length;
  }
}
