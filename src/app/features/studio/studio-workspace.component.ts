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
    <main class="studio-shell" [class.left-collapsed]="leftCollapsed()" [class.right-collapsed]="rightCollapsed()" [style.--studio-accent]="projectAccent()">
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
          <span class="status-chip">Zoom 100%</span>
          <span class="status-chip">{{ state.validationErrors().length }} issues</span>
        </div>

        <div class="topbar-actions">
          <button mat-stroked-button type="button" (click)="toggleLeftPanel()">
            <mat-icon>view_sidebar</mat-icon>
            {{ leftCollapsed() ? 'Open left' : 'Hide left' }}
          </button>
          <button mat-stroked-button type="button" (click)="toggleRightPanel()">
            <mat-icon>tune</mat-icon>
            {{ rightCollapsed() ? 'Open right' : 'Hide right' }}
          </button>
          <button mat-stroked-button type="button" [disabled]="!state.canUndo()" (click)="state.undo()">
            <mat-icon>undo</mat-icon>
            Undo
          </button>
          <button mat-stroked-button type="button" [disabled]="!state.canRedo()" (click)="state.redo()">
            <mat-icon>redo</mat-icon>
            Redo
          </button>
          <button mat-flat-button color="primary" type="button" (click)="openAiPanel()">
            <mat-icon>star</mat-icon>
            AI
          </button>
        </div>
      </header>

      <section class="workspace-grid">
        <aside class="rail rail-left">
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
                    <span>{{ section.title }}</span>
                    <small>{{ section.purpose }} · {{ section.blocks.length }} blocks</small>
                  </button>
                  <div class="nested-list">
                    @for (block of section.blocks; track block.id) {
                      <button class="stack-item nested-item" type="button" [class.active]="block.id === state.selectedBlockId()" (click)="selectBlock(section.id, block.id)">
                        <span>{{ block.title }}</span>
                        <small>{{ block.type }}</small>
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

                    <div class="block-grid" cdkDropList [cdkDropListData]="section.blocks" (cdkDropListDropped)="reorderBlocks($event)">
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

        <aside class="rail rail-right">
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
    </main>
  `,
  styles: [':host { display: block; }'],
/*
    :host { display: block; }
    .studio-shell {
      --studio-bg: #070d1a;
      --studio-panel: rgba(15, 23, 42, 0.78);
      --studio-panel-strong: rgba(255, 255, 255, 0.9);
      --studio-border: rgba(148, 163, 184, 0.14);
      --studio-text: #e2e8f0;
      --studio-muted: #94a3b8;
      min-height: 100vh;
      color: var(--studio-text);
      background:
        radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--studio-accent) 26%, transparent), transparent 28%),
        radial-gradient(circle at 86% 12%, rgba(59, 130, 246, 0.16), transparent 24%),
        linear-gradient(180deg, #020617 0%, #0f172a 100%);
      display: grid;
      grid-template-rows: auto 1fr;
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 12;
      display: grid;
      grid-template-columns: minmax(260px, 1fr) auto auto;
      gap: 1rem;
      align-items: center;
      padding: 0.9rem 1rem;
      backdrop-filter: blur(22px);
      background: rgba(2, 6, 23, 0.8);
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }
    .brand-mark {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 1rem;
      display: grid;
      place-items: center;
      color: #fff;
      background: linear-gradient(135deg, var(--studio-accent), color-mix(in srgb, var(--studio-accent) 35%, #fff));
      box-shadow: 0 16px 35px color-mix(in srgb, var(--studio-accent) 35%, transparent);
      font-family: 'Sora', sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
    }
    .brand-copy { display: grid; min-width: 0; }
    .brand-copy strong {
      font-family: 'Sora', sans-serif;
      font-size: 1rem;
      letter-spacing: -0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .brand-copy small { color: var(--studio-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .topbar-center,
    .topbar-actions,
    .toolbar-pills,
    .chip-row,
    .tool-group,
    .artboard-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .topbar-actions { justify-content: flex-end; }
    .workspace-grid {
      min-height: 0;
      display: grid;
      grid-template-columns: clamp(264px, 20vw, 332px) minmax(0, 1fr) clamp(300px, 24vw, 380px);
    }
    .studio-shell.left-collapsed .workspace-grid { grid-template-columns: 92px minmax(0, 1fr) clamp(300px, 24vw, 380px); }
    .studio-shell.right-collapsed .workspace-grid { grid-template-columns: clamp(264px, 20vw, 332px) minmax(0, 1fr) 92px; }
    .studio-shell.left-collapsed.right-collapsed .workspace-grid { grid-template-columns: 92px minmax(0, 1fr) 92px; }
    .rail {
      min-width: 0;
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      background: var(--studio-panel);
      border-right: 1px solid var(--studio-border);
      backdrop-filter: blur(24px);
    }
    .rail-right {
      border-right: 0;
      border-left: 1px solid var(--studio-border);
    }
    .studio-shell.left-collapsed .rail-left .rail-body,
    .studio-shell.left-collapsed .rail-left .rail-footer,
    .studio-shell.left-collapsed .rail-left .tab-strip,
    .studio-shell.right-collapsed .rail-right .rail-body,
    .studio-shell.right-collapsed .rail-right .rail-footer,
    .studio-shell.right-collapsed .rail-right .tab-strip {
      display: none;
    }
    .rail-head,
    .rail-footer,
    .canvas-toolbar,
    .bottom-toolbar {
      padding: 1rem;
      border-color: var(--studio-border);
    }
    .rail-head,
    .canvas-toolbar {
      border-bottom: 1px solid var(--studio-border);
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }
    .rail-footer,
    .bottom-toolbar {
      border-top: 1px solid var(--studio-border);
    }
    .rail-head h2,
    .artboard-head h1 {
      margin: 0;
      font-family: 'Sora', sans-serif;
      letter-spacing: -0.05em;
      color: #f8fafc;
    }
    .eyebrow,
    .field-label {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.7rem;
      color: color-mix(in srgb, var(--studio-accent) 75%, white);
      font-weight: 800;
    }
    .tab-strip {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.45rem;
      padding: 0.9rem;
    }
    .tab-btn,
    .page-tab,
    .stack-item,
    .tool-btn,
    .mini-chip {
      border: 0;
      border-radius: 0.95rem;
      transition: transform 160ms ease, background 160ms ease, color 160ms ease, box-shadow 160ms ease;
    }
    .tab-btn {
      display: grid;
      gap: 0.35rem;
      justify-items: center;
      padding: 0.8rem 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      color: var(--studio-muted);
      text-transform: none;
    }
    .tab-btn.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.09);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--studio-accent) 28%, transparent);
    }
    .tab-btn mat-icon,
    .tool-btn mat-icon,
    .section-meta mat-icon,
    .rail-head mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
    .rail-body {
      min-height: 0;
      overflow: auto;
      padding: 0 0.9rem 0.9rem;
    }
    .rail-panel {
      display: grid;
      gap: 0.8rem;
      padding: 0.2rem 0 1rem;
    }
    .panel-lead {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }
    .panel-lead strong,
    .prototype-card strong,
    .registry-card strong,
    .asset-card strong { display: block; color: #f8fafc; }
    .panel-lead small,
    .prototype-card small,
    .registry-card small,
    .asset-card small { color: var(--studio-muted); }
    .stack-list,
    .nested-list,
    .asset-grid,
    .registry-list,
    .prototype-stack { display: grid; gap: 0.55rem; }
    .stack-item,
    .registry-card,
    .prototype-card,
    .asset-card {
      width: 100%;
      text-align: left;
      background: rgba(255, 255, 255, 0.04);
      color: inherit;
      padding: 0.85rem 0.95rem;
      display: grid;
      gap: 0.18rem;
    }
    .stack-item:hover,
    .page-tab:hover,
    .tool-btn:hover,
    .mini-chip.button:hover { transform: translateY(-1px); }
    .stack-item.active,
    .page-tab.active,
    .tool-btn.active {
      background: color-mix(in srgb, var(--studio-accent) 18%, rgba(255, 255, 255, 0.04));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--studio-accent) 40%, transparent);
    }
    .section-item { margin-top: 0.25rem; }
    .nested-list { padding-left: 0.8rem; margin-bottom: 0.5rem; }
    .nested-item { padding-left: 0.85rem; }
    .asset-grid { grid-template-columns: 1fr; }
    .asset-card {
      grid-template-columns: auto 1fr;
      align-items: center;
      border-radius: 1rem;
    }
    .asset-card mat-icon {
      color: color-mix(in srgb, var(--studio-accent) 70%, white);
    }
    .registry-card,
    .prototype-card {
      border-radius: 1rem;
    }
    .canvas-column {
      min-width: 0;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.04), transparent 24%),
        linear-gradient(180deg, #111827 0%, #0b1220 100%);
    }
    .canvas-toolbar {
      background: rgba(2, 6, 23, 0.35);
    }
    .page-strip { display: flex; gap: 0.45rem; flex-wrap: wrap; }
    .page-tab {
      min-width: 10rem;
      padding: 0.75rem 0.9rem;
      background: rgba(255, 255, 255, 0.04);
      color: var(--studio-muted);
      display: grid;
      gap: 0.18rem;
      text-align: left;
    }
    .page-tab span,
    .tool-btn span { font-weight: 700; }
    .page-tab small { color: var(--studio-muted); }
    .status-chip,
    .mini-chip,
    .cta-chip,
    .cta-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.42rem 0.7rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: #dbeafe;
      font-size: 0.74rem;
      font-weight: 700;
    }
    .status-chip.accent {
      background: color-mix(in srgb, var(--studio-accent) 22%, rgba(255, 255, 255, 0.08));
      color: #fff;
    }
    .mini-chip.button {
      cursor: pointer;
      border: 0;
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }
    .canvas-stage {
      position: relative;
      min-height: 0;
      overflow: auto;
      padding: 1.25rem;
    }
    .canvas-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.35), transparent 80%);
    }
    .artboard {
      position: relative;
      z-index: 1;
      max-width: 1140px;
      margin: 0 auto;
      padding: 1.1rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 2rem;
      background: rgba(15, 23, 42, 0.78);
      box-shadow: 0 30px 120px rgba(2, 6, 23, 0.45);
    }
    .artboard-head {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: end;
      padding: 0.3rem 0.25rem 1rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    }
    .artboard-head p {
      margin: 0.3rem 0 0;
      color: var(--studio-muted);
      max-width: 60ch;
    }
    .artboard-meta { justify-content: flex-end; }
    .artboard-shell {
      display: grid;
      gap: 0.9rem;
      padding: 1rem 0 0.3rem;
    }
    .section-frame {
      padding: 0.9rem;
      border-radius: 1.35rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(148, 163, 184, 0.12);
    }
    .section-frame.selected {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--studio-accent) 45%, transparent);
      background: color-mix(in srgb, var(--studio-accent) 10%, rgba(255, 255, 255, 0.04));
    }
    .section-head {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 0.75rem 0.8rem;
      border: 0;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      color: inherit;
      text-align: left;
      margin-bottom: 0.85rem;
    }
    .section-head strong,
    .block-card strong { font-family: 'Sora', sans-serif; letter-spacing: -0.04em; }
    .section-meta,
    .block-top,
    .block-bottom { display: flex; justify-content: space-between; gap: 0.75rem; align-items: center; }
    .section-meta { color: var(--studio-muted); }
    .block-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 0.75rem;
    }
    .block-card {
      width: 100%;
      border-radius: 1.1rem;
      padding: 0.9rem;
      background: rgba(255, 255, 255, 0.06);
      color: inherit;
      text-align: left;
      display: grid;
      gap: 0.7rem;
      border: 1px solid rgba(148, 163, 184, 0.12);
    }
    .block-card.selected {
      border-color: color-mix(in srgb, var(--studio-accent) 60%, white);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--studio-accent) 60%, transparent);
    }
    .block-top { font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--studio-muted); }
    .block-card p { margin: 0; color: #cbd5e1; line-height: 1.45; }
    .block-bottom { flex-wrap: wrap; }
    .cta-chip {
      background: color-mix(in srgb, var(--studio-accent) 16%, rgba(255, 255, 255, 0.08));
      color: #fff;
    }
    .cta-link {
      background: rgba(255, 255, 255, 0.05);
      color: var(--studio-muted);
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 500;
    }
    .bottom-toolbar {
      background: rgba(2, 6, 23, 0.46);
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .tool-group { gap: 0.45rem; }
    .tool-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.72rem 0.88rem;
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      text-transform: none;
    }
    .tool-btn.accent {
      background: color-mix(in srgb, var(--studio-accent) 18%, rgba(255, 255, 255, 0.06));
      color: #fff;
    }
    .field {
      width: 100%;
      border-radius: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: rgba(255, 255, 255, 0.06);
      color: #f8fafc;
      padding: 0.78rem 0.9rem;
      outline: none;
    }
    .field:focus {
      border-color: color-mix(in srgb, var(--studio-accent) 65%, white);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--studio-accent) 15%, transparent);
    }
    .field-label { margin-top: 0.3rem; }
    .chip-row { margin-top: 0.25rem; }
    .studio-shell .mat-mdc-stroked-button,
    .studio-shell .mat-mdc-unelevated-button,
    .studio-shell .mat-mdc-raised-button,
    .studio-shell .mat-mdc-outlined-button {
      border-radius: 999px;
    }
    .studio-shell button mat-icon {
      margin-right: 0.35rem;
      width: 1.1rem;
      height: 1.1rem;
      font-size: 1.1rem;
    }
  `],
*/
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
  }

  selectSection(sectionId: string): void {
    this.state.setSelectedSection(sectionId);
    this.rightTab.set('design');
  }

  selectBlock(sectionId: string, blockId: string): void {
    this.state.setSelectedSection(sectionId);
    this.state.setSelectedBlock(blockId);
    this.rightTab.set('design');
  }

  activateTool(toolId: ToolId): void {
    this.activeTool.set(toolId);
    if (toolId === 'connect') {
      this.rightTab.set('prototype');
    }
  }

  toggleLeftPanel(): void {
    this.leftCollapsed.update((value) => !value);
  }

  toggleRightPanel(): void {
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
  }

  zoomIn(): void {
    this.zoom.update((value) => Math.min(160, value + 10));
  }

  zoomOut(): void {
    this.zoom.update((value) => Math.max(70, value - 10));
  }

  reorderBlocks(event: CdkDragDrop<SiteBlock[]>): void {
    const ids = event.container.data.map((block) => block.id);
    this.state.reorderBlocks(ids);
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
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
      this.activateTool('select');
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openAiPanel();
    }
  }
}
