import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, CommonModule],
  template: `
    <div class="sidebar-wrapper">
      <div class="sidebar-logo">
        <mat-icon class="logo-icon">dashboard</mat-icon>
        <span class="logo-text">AppPortal</span>
      </div>
      <nav class="sidebar-nav">
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <a
              mat-list-item
              [routerLink]="item.route"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: item.route === '/home' }"
              class="nav-item"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--primary-900);
      color: #f1f5f9; /* Slate 100 */
    }
    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 16px;
    }
    .logo-icon {
      color: var(--accent-500);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .logo-text {
      color: white;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .sidebar-nav { flex: 1; padding: 0 12px; }
    
    .nav-item {
      color: #94a3b8 !important; /* Slate 400 */
      border-radius: 6px;
      margin: 4px 0;
      height: 44px !important;
      transition: all 0.2s ease-in-out;
      border-left: 3px solid transparent;
    }
    
    .nav-item:hover {
      background: rgba(255,255,255,0.05) !important;
      color: #f8fafc !important; /* Slate 50 */
    }
    
    .nav-item mat-icon {
      color: #64748b; /* Slate 500 */
      margin-right: 12px;
      font-size: 22px;
    }
    
    .nav-item:hover mat-icon {
      color: #94a3b8; /* Slate 400 */
    }
    
    :host ::ng-deep .active-link {
      background: rgba(37, 99, 235, 0.1) !important; /* Accent 600 at 10% */
      color: white !important;
      border-left: 3px solid var(--accent-500) !important;
      font-weight: 500;
    }
    
    :host ::ng-deep .active-link mat-icon {
      color: var(--accent-500) !important;
    }
  `],
})
export class SidebarComponent {
  private authService = inject(AuthService);

  get navItems(): NavItem[] {
    const items: NavItem[] = [
      { label: 'Home', icon: 'home', route: '/home' },
      { label: 'Users', icon: 'people', route: '/users' },
      { label: 'Bookings', icon: 'event', route: '/bookings' },
    ];
    if (this.authService.currentUser?.role === 'admin') {
      items.push({ label: 'Invoices', icon: 'receipt_long', route: '/invoices' });
    }
    items.push({ label: 'Settings', icon: 'settings', route: '/settings' });
    return items;
  }
}
