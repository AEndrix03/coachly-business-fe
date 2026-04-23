import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import type { BlockDefinition } from '../models/block-registry.models';
import type { SiteBlock, SiteDraft, SiteSection } from '../models/site-draft.models';
import type { LeftTab, TabDefinition, StudioBlockSelection } from '../studio-workspace.types';

@Component({
  standalone: true,
  selector: 'app-studio-navigator',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  template: `
    <aside class="rail rail-left" [attr.aria-hidden]="hidden()">
      <div class="rail-head">
        <div>
          <p class="eyebrow">Navigator</p>
          <h2>Project structure</h2>
        </div>
        <button mat-icon-button type="button" (click)="panelToggle.emit()" aria-label="Collapse left rail">
          <mat-icon>{{ collapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
        </button>
      </div>

      <div class="tab-strip">
        @for (tab of tabs(); track tab.id) {
          <button class="tab-btn" type="button" [class.active]="activeTab() === tab.id" (click)="tabChange.emit(tab.id)">
            <mat-icon>{{ tab.icon }}</mat-icon>
            <span>{{ tab.label }}</span>
          </button>
        }
      </div>

      <div class="rail-body">
        @if (activeTab() === 'pages') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>Pages</strong>
                <small>{{ draft().pages.length }} pages</small>
              </div>
              <button mat-stroked-button type="button" (click)="pageAdd.emit()">New page</button>
            </div>
            <div class="project-card-mini">
              <div>
                <p class="mini-label">Project</p>
                <strong>{{ projectName() }}</strong>
                <small>{{ projectDescription() }}</small>
              </div>
              <div class="mini-meta">
                <span>{{ projectPageCount() }} pages</span>
                <span>{{ projectOwner() }}</span>
              </div>
            </div>
            <div class="stack-list">
              @for (page of draft().pages; track page.id) {
                <button class="stack-item" type="button" [class.active]="page.id === selectedPageId()" (click)="pageSelected.emit(page.id)">
                  <div class="stack-main">
                    <span>{{ page.title }}</span>
                    <small>{{ page.summary }}</small>
                  </div>
                  <div class="stack-side">
                    <span>{{ page.slug }}</span>
                    <small>{{ page.sections.length }} sections</small>
                  </div>
                </button>
              }
            </div>
          </div>
        }

        @if (activeTab() === 'layers') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>Layers</strong>
                <small>Selection tree</small>
              </div>
              <button mat-stroked-button type="button" (click)="sectionAdd.emit()">Add section</button>
            </div>

            @for (section of selectedSections(); track section.id) {
              <button class="stack-item section-item" type="button" [class.active]="section.id === selectedSectionId()" (click)="sectionSelected.emit(section.id)">
                <div class="stack-main">
                  <span>{{ section.title }}</span>
                  <small>{{ section.purpose }}</small>
                </div>
                <div class="stack-side">
                  <span>{{ section.blocks.length }} blocks</span>
                  <small>Section</small>
                </div>
              </button>
              <div class="nested-list">
                @for (block of section.blocks; track block.id) {
                  <button class="stack-item nested-item" type="button" [class.active]="block.id === selectedBlockId()" (click)="blockSelected.emit({ sectionId: section.id, blockId: block.id })">
                    <div class="stack-main">
                      <span>{{ block.title }}</span>
                      <small>{{ block.body }}</small>
                    </div>
                    <div class="stack-side">
                      <span>{{ block.type }}</span>
                      <small>
                        @if (block.ctaLabel) {
                          {{ block.ctaLabel }}
                        } @else {
                          Layer
                        }
                      </small>
                    </div>
                  </button>
                }
              </div>
            }
          </div>
        }

        @if (activeTab() === 'assets') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>Assets</strong>
                <small>Library + registry</small>
              </div>
              <button mat-stroked-button type="button" (click)="ctaBlockAdd.emit()">Add CTA</button>
            </div>
            <div class="asset-grid">
              @for (asset of draft().assets; track asset.id) {
                <div class="asset-card">
                  <mat-icon>{{ assetIcon(asset.type) }}</mat-icon>
                  <div>
                    <strong>{{ asset.label }}</strong>
                    <small>{{ asset.type }}</small>
                  </div>
                </div>
              }
            </div>
            <mat-divider></mat-divider>
            <div class="registry-list">
              @for (item of registry(); track item.type) {
                <div class="registry-card">
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.aiHints.join(' · ') }}</small>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="rail-footer">
        <button mat-flat-button color="primary" type="button" (click)="sectionAdd.emit()">Add section</button>
        <button mat-stroked-button type="button" (click)="aiOpen.emit()">Spark AI</button>
      </div>
    </aside>
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioNavigatorComponent {
  readonly draft = input.required<SiteDraft>();
  readonly registry = input.required<BlockDefinition[]>();
  readonly tabs = input.required<Array<TabDefinition<LeftTab>>>();
  readonly activeTab = input.required<LeftTab>();
  readonly selectedPageId = input.required<string>();
  readonly selectedSections = input.required<SiteSection[]>();
  readonly selectedSectionId = input.required<string>();
  readonly selectedBlockId = input.required<string>();
  readonly projectName = input.required<string>();
  readonly projectDescription = input.required<string>();
  readonly projectOwner = input.required<string>();
  readonly projectPageCount = input.required<number>();
  readonly collapsed = input.required<boolean>();
  readonly hidden = input.required<boolean>();

  readonly panelToggle = output<void>();
  readonly tabChange = output<LeftTab>();
  readonly pageSelected = output<string>();
  readonly sectionSelected = output<string>();
  readonly blockSelected = output<StudioBlockSelection>();
  readonly pageAdd = output<void>();
  readonly sectionAdd = output<void>();
  readonly ctaBlockAdd = output<void>();
  readonly aiOpen = output<void>();

  protected assetIcon(type: SiteBlock['type'] | 'image' | 'video' | 'document' | 'badge'): string {
    if (type === 'image') return 'image';
    if (type === 'video') return 'smart_display';
    return 'folder';
  }
}
