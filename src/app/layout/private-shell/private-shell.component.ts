import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  standalone: true,
  selector: 'app-private-shell',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell shell-private">
      <mat-toolbar class="topbar">
        <a class="brand" routerLink="/app" aria-label="Coachly app home">
          <span class="brand-mark">CA</span>
          <span class="brand-name">
            <strong>Coachly App</strong>
            <span>Private workspace</span>
          </span>
        </a>

        <span class="spacer"></span>

        <nav class="topbar-nav" aria-label="Private navigation">
          <a mat-button routerLink="/app" routerLinkActive="is-active">Overview</a>
          <a mat-button routerLink="/app/studio" routerLinkActive="is-active">Studio</a>
          <a mat-button routerLink="/app/clients" routerLinkActive="is-active">Clients</a>
          <a mat-button routerLink="/app/messages" routerLinkActive="is-active">Messages</a>
          <a mat-button routerLink="/app/analytics" routerLinkActive="is-active">Analytics</a>
          <a mat-button routerLink="/app/webflow" routerLinkActive="is-active">Webflow</a>
          <a mat-button routerLink="/public" routerLinkActive="is-active">Public</a>
        </nav>

        <button mat-stroked-button type="button" (click)="authService.logout()">Logout</button>
        <button mat-icon-button type="button" class="theme-toggle" (click)="themeService.toggle()" aria-label="Toggle theme">
          <mat-icon>{{ themeService.themeMode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
      </mat-toolbar>

      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './private-shell.component.scss',
})
export class PrivateShellComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
}
