import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ThemeService } from '../../core/theme/theme.service';

@Component({
  standalone: true,
  selector: 'app-public-shell',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell shell-public">
      <mat-toolbar class="topbar">
        <a class="brand" routerLink="/public" aria-label="Coachly home">
          <span class="brand-mark">CL</span>
          <span class="brand-name">
            <strong>Coachly</strong>
            <span>Architecture standard</span>
          </span>
        </a>

        <span class="spacer"></span>

        <nav class="topbar-nav" aria-label="Public navigation">
          <a mat-button routerLink="/public" routerLinkActive="is-active">Public</a>
          <a mat-button routerLink="/app" routerLinkActive="is-active">App</a>
          <a mat-button routerLink="/app/upgrade" routerLinkActive="is-active">Pro</a>
        </nav>

        <button mat-icon-button type="button" class="theme-toggle" (click)="themeService.toggle()" aria-label="Toggle theme">
          <mat-icon>{{ themeService.themeMode() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
      </mat-toolbar>

      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './public-shell.component.scss',
})
export class PublicShellComponent {
  protected readonly themeService = inject(ThemeService);
}
