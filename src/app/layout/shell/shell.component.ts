import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, MatSidenavModule],
  template: `
    <mat-sidenav-container class="shell-container">
      <mat-sidenav mode="side" opened class="shell-sidenav">
        <app-sidebar />
      </mat-sidenav>
      <mat-sidenav-content class="shell-content">
        <app-header />
        <main class="main-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container { height: 100vh; background-color: var(--bg-canvas); }
    .shell-sidenav {
      width: 256px;
      border-right: none;
      background-color: var(--primary-900);
    }
    .shell-content { display: flex; flex-direction: column; background-color: var(--bg-canvas); }
    .main-content {
      flex: 1;
      padding: 32px 40px; /* Wider padding for enterprise feel */
      min-height: calc(100vh - 64px);
      overflow-y: auto;
    }
  `],
})
export class ShellComponent {}
