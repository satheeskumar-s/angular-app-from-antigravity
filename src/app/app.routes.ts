import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./features/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'users/:id/edit',
        loadComponent: () =>
          import('./features/users/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./features/users/user-detail/user-detail.component').then(
            (m) => m.UserDetailComponent
          ),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/bookings/booking-list/booking-list.component').then(
            (m) => m.BookingListComponent
          ),
      },
      {
        path: 'bookings/new',
        loadComponent: () =>
          import('./features/bookings/booking-form/booking-form.component').then(
            (m) => m.BookingFormComponent
          ),
      },
      {
        path: 'bookings/:id/edit',
        loadComponent: () =>
          import('./features/bookings/booking-form/booking-form.component').then(
            (m) => m.BookingFormComponent
          ),
      },
      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('./features/bookings/booking-detail/booking-detail.component').then(
            (m) => m.BookingDetailComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'invoices',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/invoices/invoice-list/invoice-list.component').then(
                (m) => m.InvoiceListComponent
              ),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/invoices/invoice-form/invoice-form.component').then(
                (m) => m.InvoiceFormComponent
              ),
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/invoices/invoice-form/invoice-form.component').then(
                (m) => m.InvoiceFormComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/invoices/invoice-detail/invoice-detail.component').then(
                (m) => m.InvoiceDetailComponent
              ),
          },
        ]
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
