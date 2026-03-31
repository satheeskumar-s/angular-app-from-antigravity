import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
    phone: '+1-555-0101',
    department: 'Engineering',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob@example.com',
    role: 'manager',
    status: 'active',
    phone: '+1-555-0102',
    department: 'Sales',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol@example.com',
    role: 'user',
    status: 'inactive',
    phone: '+1-555-0103',
    department: 'HR',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david@example.com',
    role: 'user',
    status: 'active',
    phone: '+1-555-0104',
    department: 'Finance',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-04-12'),
  },
  {
    id: '5',
    firstName: 'Eve',
    lastName: 'Davis',
    email: 'eve@example.com',
    role: 'manager',
    status: 'active',
    phone: '+1-555-0105',
    department: 'Engineering',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-05-20'),
  },
  {
    id: '6',
    firstName: 'Frank',
    lastName: 'Miller',
    email: 'frank@example.com',
    role: 'user',
    status: 'active',
    phone: '+1-555-0106',
    department: 'Marketing',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: '7',
    firstName: 'Grace',
    lastName: 'Wilson',
    email: 'grace@example.com',
    role: 'user',
    status: 'inactive',
    phone: '+1-555-0107',
    department: 'Operations',
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-07-15'),
  },
  {
    id: '8',
    firstName: 'Henry',
    lastName: 'Moore',
    email: 'henry@example.com',
    role: 'user',
    status: 'active',
    phone: '+1-555-0108',
    department: 'Finance',
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-08-01'),
  },
];

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([...MOCK_USERS]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  private nextId = MOCK_USERS.length + 1;

  getAll(): User[] {
    return this.usersSubject.value;
  }

  getById(id: string): User | undefined {
    return this.usersSubject.value.find((u) => u.id === id);
  }

  create(dto: CreateUserDto): User {
    const now = new Date();
    const user: User = {
      ...dto,
      id: String(this.nextId++),
      createdAt: now,
      updatedAt: now,
    };
    this.usersSubject.next([...this.usersSubject.value, user]);
    return user;
  }

  update(id: string, dto: UpdateUserDto): User | null {
    const users = this.usersSubject.value;
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    const updated = { ...users[idx], ...dto, updatedAt: new Date() };
    const newUsers = [...users];
    newUsers[idx] = updated;
    this.usersSubject.next(newUsers);
    return updated;
  }

  delete(id: string): boolean {
    const users = this.usersSubject.value;
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    this.usersSubject.next(filtered);
    return true;
  }

  getTotalCount(): number {
    return this.usersSubject.value.length;
  }

  getActiveCount(): number {
    return this.usersSubject.value.filter((u) => u.status === 'active').length;
  }
}
