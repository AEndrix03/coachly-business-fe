import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import type { SiteBlock, SitePage } from '../models/site-draft.models';
import type { StudioBlockReorder, StudioBlockSelection, ToolDefinition, ToolId } from '../studio-workspace.types';

@Component({
  standalone: true,
  selector: 'app-studio-canvas',
  imports: [DragDropModule, MatButtonModule, MatIconModule],
  template: `
    <section class="canvas-column">
      <div class="canvas-toolbar">
        <div class="page-strip" aria-label="Page switcher">
          @for (page of pages(); track page.id) {
            <button class="page-tab" type="button" [class.active]="page.id === selectedPageId()" (click)="pageSelected.emit(page.id)">
              <span>{{ page.title }}</span>
              <small>{{ page.slug }}</small>
            </button>
          }
        </div>
        <div class="toolbar-pills">
          <span class="status-chip">Frame 1440</span>
          <span class="status-chip">Prototype ready</span>
          <button mat-stroked-button type="button" (click)="zoomOut.emit()">-</button>
          <span class="status-chip accent">{{ zoom() }}%</span>
          <button mat-stroked-button type="button" (click)="zoomIn.emit()">+</button>
        </div>
      </div>

      <div class="canvas-stage">
        <div class="canvas-grid"></div>
        <article class="artboard">
          <header class="artboard-head">
            <div>
              <p class="eyebrow">Canvas</p>
              <h1>{{ selectedPage().title }}</h1>
              <p>{{ selectedPage().summary }}</p>
            </div>
            <div class="artboard-meta">
              <span class="status-chip accent">SEO ready</span>
              <span class="status-chip">{{ selectedPage().sections.length }} sections</span>
              <span class="status-chip">{{ brandName() }}</span>
            </div>
          </header>

          <div class="artboard-shell">
            @for (section of selectedPage().sections; track section.id) {
              <section class="section-frame" [class.selected]="section.id === selectedSectionId()">
                <button class="section-head" type="button" (click)="sectionSelected.emit(section.id)">
                  <div>
                    <strong>{{ section.title }}</strong>
                    <small>{{ section.purpose }}</small>
                  </div>
                  <div class="section-meta">
                    <span>{{ section.blocks.length }} blocks</span>
                    <mat-icon>chevron_right</mat-icon>
                  </div>
                </button>

                <div class="block-grid" cdkDropList [cdkDropListData]="section.blocks" (cdkDropListDropped)="onBlockDrop($event, section.id)">
                  @for (block of section.blocks; track block.id) {
                    <button
                      class="block-card"
                      cdkDrag
                      type="button"
                      [class.selected]="block.id === selectedBlockId()"
                      (click)="blockSelected.emit({ sectionId: section.id, blockId: block.id })">
                      <div class="block-top">
                        <span>{{ block.type }}</span>
                        @if (block.assetIds?.length) {
                          <span>{{ block.assetIds?.length }} assets</span>
                        }
                      </div>
                      <strong>{{ block.title }}</strong>
                      <p>{{ block.body }}</p>
                      <div class="block-bottom">
                        @if (block.ctaLabel) {
                          <span class="cta-chip">{{ block.ctaLabel }}</span>
                        }
                        @if (block.ctaHref) {
                          <span class="cta-link">{{ block.ctaHref }}</span>
                        }
                      </div>
                    </button>
                  }
                </div>
              </section>
            }
          </div>
        </article>
      </div>

      <footer class="bottom-toolbar">
        <div class="tool-group">
          @for (tool of tools(); track tool.id) {
            <button class="tool-btn" type="button" [class.active]="activeTool() === tool.id" (click)="toolActivated.emit(tool.id)">
              <mat-icon>{{ tool.icon }}</mat-icon>
              <span>{{ tool.label }}</span>
            </button>
          }
        </div>

        <div class="tool-group">
          <button class="tool-btn accent" type="button" (click)="aiOpen.emit()">
            <mat-icon>star</mat-icon>
            <span>AI action</span>
          </button>
        </div>
      </footer>
    </section>
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioCanvasComponent {
  readonly pages = input.required<SitePage[]>();
  readonly selectedPage = input.required<SitePage>();
  readonly selectedPageId = input.required<string>();
  readonly selectedSectionId = input.required<string>();
  readonly selectedBlockId = input.required<string>();
  readonly brandName = input.required<string>();
  readonly zoom = input.required<number>();
  readonly activeTool = input.required<ToolId>();
  readonly tools = input.required<ToolDefinition[]>();

  readonly pageSelected = output<string>();
  readonly sectionSelected = output<string>();
  readonly blockSelected = output<StudioBlockSelection>();
  readonly blockReordered = output<StudioBlockReorder>();
  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly toolActivated = output<ToolId>();
  readonly aiOpen = output<void>();

  protected onBlockDrop(event: CdkDragDrop<SiteBlock[]>, sectionId: string): void {
    if (event.previousIndex === event.currentIndex) return;
    this.blockReordered.emit({
      sectionId,
      blockIds: event.container.data.map((block) => block.id),
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
