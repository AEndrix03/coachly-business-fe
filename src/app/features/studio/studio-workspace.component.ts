import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { COACH_BLOCK_REGISTRY } from './models/block-registry.models';
import type { SiteBlock } from './models/site-draft.models';
import { StudioStateService } from './services/studio-state.service';
import { getStudioProject } from './studio.catalog';

type LeftTab = 'pages' | 'layers' | 'assets';
type RightTab = 'design' | 'prototype' | 'ai';
type ToolId = 'select' | 'hand' | 'frame' | 'shape' | 'text' | 'comment' | 'connect';
type MobilePanel = 'none' | 'left' | 'right';

interface ToolDefinition {
  id: ToolId;
  icon: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-studio-workspace',
  imports: [DragDropModule, FormsModule, MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  template: `
    <main
      class="studio-shell"
      [class.left-collapsed]="leftCollapsed()"
      [class.right-collapsed]="rightCollapsed()"
      [class.mobile-left-open]="mobilePanel() === 'left'"
      [class.mobile-right-open]="mobilePanel() === 'right'"
      [style.--studio-accent]="projectAccent()">
      <header class="topbar">
        <a class="brand" routerLink="/app/studio" aria-label="Back to studio chooser">
          <span class="brand-mark">CA</span>
          <span class="brand-copy">
            <strong>{{ project()?.name ?? 'Studio' }}</strong>
            <small>{{ state.selectionPath() || pageTitle() }}</small>
          </span>
        </a>

        <div class="topbar-center">
          <span class="status-chip accent">{{ state.draft().publishState }}</span>
          <span class="status-chip">Zoom {{ zoom() }}%</span>
          <span class="status-chip">{{ state.validationErrors().length }} issues</span>
        </div>

        <div class="topbar-actions">
          <button class="desktop-action" mat-stroked-button type="button" (click)="toggleLeftPanel()">
            <mat-icon>view_sidebar</mat-icon>
            {{ leftCollapsed() ? 'Open left' : 'Hide left' }}
          </button>
          <button class="desktop-action" mat-stroked-button type="button" (click)="toggleRightPanel()">
            <mat-icon>tune</mat-icon>
            {{ rightCollapsed() ? 'Open right' : 'Hide right' }}
          </button>
          <button mat-icon-button type="button" class="mobile-action" (click)="openMobilePanel('left')" aria-label="Open layers">
            <mat-icon>menu</mat-icon>
          </button>
          <button mat-icon-button type="button" class="mobile-action" (click)="openMobilePanel('right')" aria-label="Open inspector">
            <mat-icon>tune</mat-icon>
          </button>
          <button mat-stroked-button type="button" class="history-action" [disabled]="!state.canUndo()" (click)="state.undo()">
            <mat-icon>undo</mat-icon>
            Undo
          </button>
          <button mat-stroked-button type="button" class="history-action" [disabled]="!state.canRedo()" (click)="state.redo()">
            <mat-icon>redo</mat-icon>
            Redo
          </button>
          <button mat-flat-button color="primary" type="button" (click)="openAiPanel()">
            <mat-icon>star</mat-icon>
            AI
          </button>
        </div>
      </header>

      @if (mobilePanel() !== 'none') {
        <button class="mobile-scrim" type="button" aria-label="Close panel" (click)="closeMobilePanel()"></button>
      }

      <section class="workspace-grid">
        <aside class="rail rail-left" [attr.aria-hidden]="mobilePanel() === 'right'">
          <div class="rail-head">
            <div>
              <p class="eyebrow">Navigator</p>
              <h2>Project structure</h2>
            </div>
            <button mat-icon-button type="button" (click)="toggleLeftPanel()" aria-label="Collapse left rail">
              <mat-icon>{{ leftCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
            </button>
          </div>

          <div class="tab-strip">
            @for (tab of leftTabs; track tab.id) {
              <button class="tab-btn" type="button" [class.active]="leftTab() === tab.id" (click)="setLeftTab(tab.id)">
                <mat-icon>{{ tab.icon }}</mat-icon>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>

          <div class="rail-body">
            @if (leftTab() === 'pages') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>Pages</strong>
                    <small>{{ state.draft().pages.length }} pages</small>
                  </div>
                  <button mat-stroked-button type="button" (click)="state.addPage()">New page</button>
                </div>
                <div class="project-card-mini">
                  <div>
                    <p class="mini-label">Project</p>
                    <strong>{{ project()?.name ?? 'Studio' }}</strong>
                    <small>{{ project()?.description ?? 'Route-backed workspace' }}</small>
                  </div>
                  <div class="mini-meta">
                    <span>{{ projectPageCount() }} pages</span>
                    <span>{{ project()?.owner ?? 'Coach' }}</span>
                  </div>
                </div>
                <div class="stack-list">
                  @for (page of state.draft().pages; track page.id) {
                    <button class="stack-item" type="button" [class.active]="page.id === state.selectedPageId()" (click)="selectPage(page.id)">
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

            @if (leftTab() === 'layers') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>Layers</strong>
                    <small>Selection tree</small>
                  </div>
                  <button mat-stroked-button type="button" (click)="state.addSection()">Add section</button>
                </div>

                @for (section of state.selectedPage().sections; track section.id) {
                  <button class="stack-item section-item" type="button" [class.active]="section.id === state.selectedSectionId()" (click)="selectSection(section.id)">
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
                      <button class="stack-item nested-item" type="button" [class.active]="block.id === state.selectedBlockId()" (click)="selectBlock(section.id, block.id)">
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

            @if (leftTab() === 'assets') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>Assets</strong>
                    <small>Library + registry</small>
                  </div>
                  <button mat-stroked-button type="button" (click)="state.addBlock('cta')">Add CTA</button>
                </div>
                <div class="asset-grid">
                  @for (asset of state.draft().assets; track asset.id) {
                    <div class="asset-card">
                      <mat-icon>{{ asset.type === 'image' ? 'image' : asset.type === 'video' ? 'smart_display' : 'folder' }}</mat-icon>
                      <div>
                        <strong>{{ asset.label }}</strong>
                        <small>{{ asset.type }}</small>
                      </div>
                    </div>
                  }
                </div>
                <mat-divider></mat-divider>
                <div class="registry-list">
                  @for (item of registry; track item.type) {
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
            <button mat-flat-button color="primary" type="button" (click)="state.addSection()">Add section</button>
            <button mat-stroked-button type="button" (click)="openAiPanel()">Spark AI</button>
          </div>
        </aside>

        <section class="canvas-column">
          <div class="canvas-toolbar">
            <div class="page-strip" aria-label="Page switcher">
              @for (page of state.draft().pages; track page.id) {
                <button class="page-tab" type="button" [class.active]="page.id === state.selectedPageId()" (click)="selectPage(page.id)">
                  <span>{{ page.title }}</span>
                  <small>{{ page.slug }}</small>
                </button>
              }
            </div>
            <div class="toolbar-pills">
              <span class="status-chip">Frame 1440</span>
              <span class="status-chip">Prototype ready</span>
              <button mat-stroked-button type="button" (click)="zoomOut()">-</button>
              <span class="status-chip accent">{{ zoom() }}%</span>
              <button mat-stroked-button type="button" (click)="zoomIn()">+</button>
            </div>
          </div>

          <div class="canvas-stage">
            <div class="canvas-grid"></div>
            <article class="artboard">
              <header class="artboard-head">
                <div>
                  <p class="eyebrow">Canvas</p>
                  <h1>{{ state.selectedPage().title }}</h1>
                  <p>{{ state.selectedPage().summary }}</p>
                </div>
                <div class="artboard-meta">
                  <span class="status-chip accent">SEO ready</span>
                  <span class="status-chip">{{ state.selectedPage().sections.length }} sections</span>
                  <span class="status-chip">{{ project()?.draft?.theme?.brandName ?? 'Coachly' }}</span>
                </div>
              </header>

              <div class="artboard-shell">
                @for (section of state.selectedPage().sections; track section.id) {
                  <section class="section-frame" [class.selected]="section.id === state.selectedSectionId()">
                    <button class="section-head" type="button" (click)="selectSection(section.id)">
                      <div>
                        <strong>{{ section.title }}</strong>
                        <small>{{ section.purpose }}</small>
                      </div>
                      <div class="section-meta">
                        <span>{{ section.blocks.length }} blocks</span>
                        <mat-icon>chevron_right</mat-icon>
                      </div>
                    </button>

                    <div class="block-grid" cdkDropList [cdkDropListData]="section.blocks" (cdkDropListDropped)="reorderBlocks($event, section.id)">
                      @for (block of section.blocks; track block.id) {
                        <button
                          class="block-card"
                          cdkDrag
                          type="button"
                          [class.selected]="block.id === state.selectedBlockId()"
                          (click)="selectBlock(section.id, block.id)">
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
              @for (tool of tools; track tool.id) {
                <button class="tool-btn" type="button" [class.active]="activeTool() === tool.id" (click)="activateTool(tool.id)">
                  <mat-icon>{{ tool.icon }}</mat-icon>
                  <span>{{ tool.label }}</span>
                </button>
              }
            </div>

            <div class="tool-group">
              <button class="tool-btn accent" type="button" (click)="openAiPanel()">
                <mat-icon>star</mat-icon>
                <span>AI action</span>
              </button>
            </div>
          </footer>
        </section>

        <aside class="rail rail-right" [attr.aria-hidden]="mobilePanel() === 'left'">
          <div class="rail-head">
            <div>
              <p class="eyebrow">Inspector</p>
              <h2>Design, prototype, AI</h2>
            </div>
            <button mat-icon-button type="button" (click)="toggleRightPanel()" aria-label="Collapse right rail">
              <mat-icon>{{ rightCollapsed() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
            </button>
          </div>

          <div class="tab-strip">
            @for (tab of rightTabs; track tab.id) {
              <button class="tab-btn" type="button" [class.active]="rightTab() === tab.id" (click)="setRightTab(tab.id)">
                <mat-icon>{{ tab.icon }}</mat-icon>
                <span>{{ tab.label }}</span>
              </button>
            }
          </div>

          <div class="rail-body">
            @if (rightTab() === 'design') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>Selection</strong>
                    <small>{{ state.selectionPath() || 'Page' }}</small>
                  </div>
                  <span class="status-chip accent">Design</span>
                </div>

                <div class="focus-strip">
                  <span class="focus-chip page">Page</span>
                  <span class="focus-chip section">Section</span>
                  <span class="focus-chip block">Block</span>
                  <span class="focus-chip summary">{{ state.selectedPage().slug }}</span>
                </div>

                <div class="scope-stack">
                  <section class="inspector-card scope-page">
                    <div class="panel-lead compact">
                      <div>
                        <p class="mini-label">Page</p>
                        <strong>{{ state.selectedPage().title }}</strong>
                      </div>
                      <span class="status-chip">Route</span>
                    </div>
                    <label class="field-label">Page title</label>
                    <input class="field" [ngModel]="state.selectedPage().title" (ngModelChange)="state.updateSelectedPage({ title: $event })" />
                    <label class="field-label">Summary</label>
                    <textarea class="field" rows="3" [ngModel]="state.selectedPage().summary" (ngModelChange)="state.updateSelectedPage({ summary: $event })"></textarea>
                  </section>

                  <section class="inspector-card scope-section">
                    <div class="panel-lead compact">
                      <div>
                        <p class="mini-label">Section</p>
                        <strong>{{ state.selectedSection().title }}</strong>
                      </div>
                      <span class="status-chip">Layout</span>
                    </div>
                    <label class="field-label">Section title</label>
                    <input class="field" [ngModel]="state.selectedSection().title" (ngModelChange)="state.updateSelectedSection({ title: $event })" />
                    <div class="chip-row">
                      <span class="mini-chip">{{ state.selectedSection().purpose }}</span>
                      <span class="mini-chip">{{ state.selectedSection().blocks.length }} blocks</span>
                    </div>
                  </section>

                  <section class="inspector-card scope-block">
                    <div class="panel-lead compact">
                      <div>
                        <p class="mini-label">Block</p>
                        <strong>{{ state.selectedBlock().title }}</strong>
                      </div>
                      <span class="status-chip accent">{{ state.selectedBlock().type }}</span>
                    </div>
                    <label class="field-label">Block title</label>
                    <input class="field" [ngModel]="state.selectedBlock().title" (ngModelChange)="state.updateSelectedBlock({ title: $event })" />
                    <label class="field-label">Block copy</label>
                    <textarea class="field" rows="6" [ngModel]="state.selectedBlock().body" (ngModelChange)="state.updateSelectedBlock({ body: $event })"></textarea>
                    <div class="chip-row">
                      <span class="mini-chip">Drag to reorder</span>
                      <span class="mini-chip">Autosave on route</span>
                      <span class="mini-chip">Undo safe</span>
                    </div>
                  </section>
                </div>
              </div>
            }

            @if (rightTab() === 'prototype') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>Prototype</strong>
                    <small>Flow and interactions</small>
                  </div>
                  <span class="status-chip accent">On</span>
                </div>

                <div class="prototype-stack">
                  <div class="prototype-card">
                    <strong>Start point</strong>
                    <small>{{ state.selectedPage().slug }}</small>
                  </div>
                  <div class="prototype-card">
                    <strong>Interaction</strong>
                    <small>Click canvas, sidebar and layers stay in sync.</small>
                  </div>
                  <div class="prototype-card">
                    <strong>Shortcut</strong>
                    <small>Space = hand, Cmd/Ctrl + K = AI.</small>
                  </div>
                </div>
              </div>
            }

            @if (rightTab() === 'ai') {
              <div class="rail-panel">
                <div class="panel-lead">
                  <div>
                    <strong>AI</strong>
                    <small>Contextual actions</small>
                  </div>
                  <span class="status-chip accent">Spark</span>
                </div>

                <textarea class="field" rows="7" [ngModel]="state.aiPrompt()" (ngModelChange)="state.setAiPrompt($event)"></textarea>
                <div class="chip-row">
                  @for (prompt of aiPrompts; track prompt) {
                    <button class="mini-chip button" type="button" (click)="state.setAiPrompt(prompt)">{{ prompt }}</button>
                  }
                </div>
                <button mat-flat-button color="primary" type="button" (click)="state.applyAiPrompt(state.aiPrompt())">Apply AI suggestion</button>

                <div class="prototype-card">
                  <strong>Next step</strong>
                  <small>{{ state.nextStep() }}</small>
                </div>
              </div>
            }
          </div>

          <div class="rail-footer">
            <button mat-flat-button color="primary" type="button" (click)="state.applyAiPrompt('Increase trust, shorten the hero, sharpen CTA')">
              Rewrite hero
            </button>
            <button mat-stroked-button type="button" (click)="state.addPage()">Add page</button>
          </div>
        </aside>
      </section>

      <nav class="mobile-dock" aria-label="Studio mobile navigation">
        <button type="button" [class.active]="mobilePanel() === 'left'" (click)="openMobilePanel('left')">
          <mat-icon>account_tree</mat-icon>
          <span>Layers</span>
        </button>
        <button type="button" [class.active]="activeTool() === 'select'" (click)="activateTool('select')">
          <mat-icon>ads_click</mat-icon>
          <span>Select</span>
        </button>
        <button type="button" [class.active]="rightTab() === 'ai'" (click)="openAiPanel()">
          <mat-icon>auto_awesome</mat-icon>
          <span>AI</span>
        </button>
        <button type="button" [class.active]="mobilePanel() === 'right'" (click)="openMobilePanel('right')">
          <mat-icon>tune</mat-icon>
          <span>Inspect</span>
        </button>
      </nav>
    </main>
  `,
  styles: [':host { display: block; }'],
})
export class StudioWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly state = inject(StudioStateService);
  protected readonly registry = COACH_BLOCK_REGISTRY;
  protected readonly tools: ToolDefinition[] = [
    { id: 'select', icon: 'ads_click', label: 'Select' },
    { id: 'hand', icon: 'pan_tool_alt', label: 'Hand' },
    { id: 'frame', icon: 'crop_square', label: 'Frame' },
    { id: 'shape', icon: 'rectangle', label: 'Shape' },
    { id: 'text', icon: 'title', label: 'Text' },
    { id: 'comment', icon: 'mode_comment', label: 'Comment' },
    { id: 'connect', icon: 'device_hub', label: 'Connect' },
  ];
  protected readonly leftTabs: Array<{ id: LeftTab; label: string; icon: string }> = [
    { id: 'pages', label: 'Pages', icon: 'layers' },
    { id: 'layers', label: 'Layers', icon: 'account_tree' },
    { id: 'assets', label: 'Assets', icon: 'inventory_2' },
  ];
  protected readonly rightTabs: Array<{ id: RightTab; label: string; icon: string }> = [
    { id: 'design', label: 'Design', icon: 'brush' },
    { id: 'prototype', label: 'Prototype', icon: 'route' },
    { id: 'ai', label: 'AI', icon: 'auto_awesome' },
  ];
  protected readonly aiPrompts = [
    'Sharpen the hero',
    'Increase trust signals',
    'Simplify CTA copy',
    'Turn proof into metrics',
  ];
  protected readonly project = signal(getStudioProject(this.route.snapshot.paramMap.get('projectId')));
  protected readonly activeTool = signal<ToolId>('select');
  protected readonly leftTab = signal<LeftTab>('pages');
  protected readonly rightTab = signal<RightTab>('design');
  protected readonly leftCollapsed = signal(false);
  protected readonly rightCollapsed = signal(false);
  protected readonly mobilePanel = signal<MobilePanel>('none');
  protected readonly zoom = signal(100);

  constructor() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const pageId = this.route.snapshot.paramMap.get('pageId') ?? undefined;
    const project = getStudioProject(projectId);
    const page = project?.draft.pages.find((item) => item.id === pageId);

    if (!project || !page) {
      void this.router.navigateByUrl('/app/studio');
      return;
    }

    this.project.set(project);
    this.state.loadDraft(project.draft, { pageId });
  }

  projectAccent(): string {
    return this.project()?.accent ?? this.state.draft().theme.primaryColor;
  }

  projectPageCount(): number {
    const project = this.project();
    return project ? project.draft.pages.length : 0;
  }

  pageTitle(): string {
    return this.state.selectedPage().title;
  }

  activeToolLabel(): string {
    return this.tools.find((tool) => tool.id === this.activeTool())?.label ?? 'Select';
  }

  selectPage(pageId: string): void {
    this.state.setSelectedPage(pageId);
    this.leftTab.set('layers');
    const projectId = this.project()?.id;
    if (projectId) {
      void this.router.navigate(['/app/studio', projectId, pageId]);
    }
    this.closeMobilePanel();
  }

  selectSection(sectionId: string): void {
    this.state.setSelectedSection(sectionId);
    this.rightTab.set('design');
    this.closeMobilePanel();
  }

  selectBlock(sectionId: string, blockId: string): void {
    this.state.setSelectedSection(sectionId);
    this.state.setSelectedBlock(blockId);
    this.rightTab.set('design');
    this.closeMobilePanel();
  }

  activateTool(toolId: ToolId): void {
    this.activeTool.set(toolId);
    if (toolId === 'connect') {
      this.rightTab.set('prototype');
    }
  }

  toggleLeftPanel(): void {
    if (this.isCompactViewport()) {
      this.mobilePanel.update((panel) => panel === 'left' ? 'none' : 'left');
      return;
    }
    this.leftCollapsed.update((value) => !value);
  }

  toggleRightPanel(): void {
    if (this.isCompactViewport()) {
      this.mobilePanel.update((panel) => panel === 'right' ? 'none' : 'right');
      return;
    }
    this.rightCollapsed.update((value) => !value);
  }

  setLeftTab(tab: LeftTab): void {
    this.leftTab.set(tab);
  }

  setRightTab(tab: RightTab): void {
    this.rightTab.set(tab);
  }

  openAiPanel(): void {
    this.rightTab.set('ai');
    this.activeTool.set('select');
    if (this.isCompactViewport()) {
      this.mobilePanel.set('right');
    }
  }

  openMobilePanel(panel: Exclude<MobilePanel, 'none'>): void {
    this.mobilePanel.set(panel);
  }

  closeMobilePanel(): void {
    this.mobilePanel.set('none');
  }

  zoomIn(): void {
    this.zoom.update((value) => Math.min(160, value + 10));
  }

  zoomOut(): void {
    this.zoom.update((value) => Math.max(70, value - 10));
  }

  reorderBlocks(event: CdkDragDrop<SiteBlock[]>, sectionId: string): void {
    if (event.previousIndex === event.currentIndex) return;
    const ids = event.container.data.map((block) => block.id);
    const reorderedIds = this.state.moveArrayItem(ids, event.previousIndex, event.currentIndex);
    this.state.reorderBlocks(reorderedIds, sectionId);
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
  }

  private isCompactViewport(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 1180px)').matches;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeys(event: KeyboardEvent): void {
    if (this.isTypingTarget(event.target)) return;

    if (event.code === 'Space') {
      event.preventDefault();
      this.activateTool('hand');
      return;
    }

    if (event.key === 'Escape') {
      if (this.mobilePanel() !== 'none') {
        this.closeMobilePanel();
        return;
      }
      this.activateTool('select');
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openAiPanel();
    }
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (!this.isCompactViewport()) {
      this.closeMobilePanel();
    }
  }
}
