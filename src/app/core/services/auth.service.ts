import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUser, LoginCredentials, LoginResponse } from '../models/auth.model';

const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin' as const,
    firstName: 'Admin',
    lastName: 'User',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    email: 'manager@example.com',
    role: 'manager' as const,
    firstName: 'Jane',
    lastName: 'Manager',
  },
  {
    id: '3',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    role: 'user' as const,
    firstName: 'John',
    lastName: 'Doe',
  },
];

const AUTH_KEY = 'app_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.loadFromStorage()
  );

  currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();
  isLoggedIn$: Observable<boolean> = new BehaviorSubject<boolean>(
    !!this.currentUserSubject.value
  );

  constructor(private router: Router) {}

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): LoginResponse | null {
    const match = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );
    if (!match) return null;

    const user: AuthUser = {
      id: match.id,
      username: match.username,
      email: match.email,
      role: match.role,
      firstName: match.firstName,
      lastName: match.lastName,
    };
    const token = `mock-token-${match.id}-${Date.now()}`;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    this.currentUserSubject.next(user);
    (this.isLoggedIn$ as BehaviorSubject<boolean>).next(true);
    return { user, token };
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    this.currentUserSubject.next(null);
    (this.isLoggedIn$ as BehaviorSubject<boolean>).next(false);
    this.router.navigate(['/login']);
  }

  private loadFromStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const { user } = JSON.parse(raw);
      return user ?? null;
    } catch {
      return null;
    }
  }
}
