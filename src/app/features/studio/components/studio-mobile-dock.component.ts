import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import type { MobilePanel, RightTab, ToolId } from '../studio-workspace.types';

@Component({
  standalone: true,
  selector: 'app-studio-mobile-dock',
  imports: [MatIconModule],
  template: `
    <nav class="mobile-dock" aria-label="Studio mobile navigation">
      <button type="button" [class.active]="mobilePanel() === 'left'" (click)="panelOpen.emit('left')">
        <mat-icon>account_tree</mat-icon>
        <span>Layers</span>
      </button>
      <button type="button" [class.active]="activeTool() === 'select'" (click)="toolActivated.emit('select')">
        <mat-icon>ads_click</mat-icon>
        <span>Select</span>
      </button>
      <button type="button" [class.active]="rightTab() === 'ai'" (click)="aiOpen.emit()">
        <mat-icon>auto_awesome</mat-icon>
        <span>AI</span>
      </button>
      <button type="button" [class.active]="mobilePanel() === 'right'" (click)="panelOpen.emit('right')">
        <mat-icon>tune</mat-icon>
        <span>Inspect</span>
      </button>
    </nav>
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioMobileDockComponent {
  readonly mobilePanel = input.required<MobilePanel>();
  readonly activeTool = input.required<ToolId>();
  readonly rightTab = input.required<RightTab>();

  readonly panelOpen = output<'left' | 'right'>();
  readonly toolActivated = output<ToolId>();
  readonly aiOpen = output<void>();
}
