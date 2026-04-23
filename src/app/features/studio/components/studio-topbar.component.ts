import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import type { PublishState } from '../models/site-draft.models';

@Component({
  standalone: true,
  selector: 'app-studio-topbar',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/app/studio" aria-label="Back to studio chooser">
        <span class="brand-mark">CA</span>
        <span class="brand-copy">
          <strong>{{ projectName() }}</strong>
          <small>{{ selectionLabel() }}</small>
        </span>
      </a>

      <div class="topbar-center">
        <span class="status-chip accent">{{ publishState() }}</span>
        <span class="status-chip">Zoom {{ zoom() }}%</span>
        <span class="status-chip">{{ issueCount() }} issues</span>
      </div>

      <div class="topbar-actions">
        <button class="desktop-action" mat-stroked-button type="button" (click)="leftPanelToggle.emit()">
          <mat-icon>view_sidebar</mat-icon>
          {{ leftCollapsed() ? 'Open left' : 'Hide left' }}
        </button>
        <button class="desktop-action" mat-stroked-button type="button" (click)="rightPanelToggle.emit()">
          <mat-icon>tune</mat-icon>
          {{ rightCollapsed() ? 'Open right' : 'Hide right' }}
        </button>
        <button mat-icon-button type="button" class="mobile-action" (click)="mobilePanelOpen.emit('left')" aria-label="Open layers">
          <mat-icon>menu</mat-icon>
        </button>
        <button mat-icon-button type="button" class="mobile-action" (click)="mobilePanelOpen.emit('right')" aria-label="Open inspector">
          <mat-icon>tune</mat-icon>
        </button>
        <button mat-stroked-button type="button" class="history-action" [disabled]="!canUndo()" (click)="undo.emit()">
          <mat-icon>undo</mat-icon>
          Undo
        </button>
        <button mat-stroked-button type="button" class="history-action" [disabled]="!canRedo()" (click)="redo.emit()">
          <mat-icon>redo</mat-icon>
          Redo
        </button>
        <button mat-flat-button color="primary" type="button" (click)="aiOpen.emit()">
          <mat-icon>star</mat-icon>
          AI
        </button>
      </div>
    </header>
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioTopbarComponent {
  readonly projectName = input.required<string>();
  readonly selectionLabel = input.required<string>();
  readonly publishState = input.required<PublishState>();
  readonly zoom = input.required<number>();
  readonly issueCount = input.required<number>();
  readonly leftCollapsed = input.required<boolean>();
  readonly rightCollapsed = input.required<boolean>();
  readonly canUndo = input.required<boolean>();
  readonly canRedo = input.required<boolean>();

  readonly leftPanelToggle = output<void>();
  readonly rightPanelToggle = output<void>();
  readonly mobilePanelOpen = output<'left' | 'right'>();
  readonly undo = output<void>();
  readonly redo = output<void>();
  readonly aiOpen = output<void>();
}
