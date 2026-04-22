import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { COACH_BLOCK_REGISTRY } from './models/block-registry.models';
import type { SiteBlock } from './models/site-draft.models';
import { StudioStateService } from './services/studio-state.service';

@Component({
  standalone: true,
  selector: 'app-studio',
  imports: [DatePipe, DragDropModule, FormsModule, MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatIconModule, RouterLink],
  template: `
    <main class="studio-shell">
      <section class="hero studio-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Coach Studio Builder v2</p>
          <h1>Modifica il sito direttamente nella grafica, come in Figma.</h1>
          <p class="lead">
            Clicca un elemento nella preview, cambia il testo e aggiungi nuove parti dalla sidebar. Tutto resta
            semplice, visivo e immediato.
          </p>
          <div class="actions">
            <button mat-flat-button color="primary" type="button">Salvataggio automatico</button>
            <button mat-stroked-button type="button" (click)="copyDraftJson()">Copia JSON</button>
            <button mat-stroked-button type="button" [disabled]="!state.canUndo()" (click)="state.undo()">Annulla</button>
            <button mat-stroked-button type="button" [disabled]="!state.canRedo()" (click)="state.redo()">Ripeti</button>
            <button mat-stroked-button routerLink="/app/webflow" type="button">Vista tecnica</button>
          </div>
        </div>

        <mat-card class="panel studio-summary">
          <p class="card-label">Stato del sito</p>
          <h3>{{ state.draft().coachName }}</h3>
          <div class="summary-row"><span>Pagine</span><strong>{{ state.draft().pages.length }}</strong></div>
          <div class="summary-row"><span>Blocchi</span><strong>{{ blockCount() }}</strong></div>
          <div class="summary-row"><span>Fase</span><strong>{{ state.draft().publishState }}</strong></div>
          <div class="summary-row"><span>Ultimo cambio</span><strong>{{ state.draft().updatedAt | date: 'shortTime' }}</strong></div>
          <mat-divider></mat-divider>
          <p class="lead compact">{{ state.nextStep() }}</p>
        </mat-card>
      </section>

      <section class="workspace-grid">
        <aside class="panel rail" [class.is-collapsed]="state.leftRailCollapsed()">
          <div class="panel-head">
            <div>
              <p class="card-label">Libreria</p>
              <h3>Aggiungi pagine e componenti</h3>
            </div>
            <button mat-stroked-button type="button" (click)="state.toggleLeftRail()">
              {{ state.leftRailCollapsed() ? 'Apri' : 'Riduci' }}
            </button>
          </div>

          @if (!state.leftRailCollapsed()) {
            <button mat-flat-button color="primary" type="button" class="sidebar-item add-item" (click)="state.addPage()">Nuova pagina</button>
            <div class="sidebar-group">
              <div class="group-title">Pagine</div>
              @for (page of state.draft().pages; track page.id) {
                <button
                  mat-button
                  type="button"
                  class="sidebar-item"
                  [class.active]="page.id === state.selectedPageId()"
                  (click)="state.setSelectedPage(page.id)">
                  <span>{{ page.title }}</span>
                  <small>{{ page.slug }}</small>
                </button>
              }
            </div>

            <div class="sidebar-group">
              <div class="group-title">Componenti pronti</div>
              <button mat-stroked-button type="button" class="sidebar-item add-item" (click)="state.addSection()">+ Sezione base</button>
              <mat-chip-set class="chip-column">
                @for (block of registry; track block.type) {
                  <mat-chip (click)="state.addBlock(block.type)">{{ block.label }}</mat-chip>
                }
              </mat-chip-set>
            </div>

            <div class="sidebar-group">
              <div class="group-title">Scorciatoie</div>
              <button mat-button type="button" class="sidebar-item" (click)="jumpToSelectedBlock()">Selezione attiva</button>
              <button mat-button type="button" class="sidebar-item" (click)="copyDraftJson()">Copia JSON</button>
            </div>
          }
        </aside>

        <section class="panel canvas">
          <div class="panel-head">
            <div>
              <p class="card-label">Preview</p>
              <h3>Click to edit</h3>
            </div>
            <div class="inline-actions">
              <span class="pill">{{ state.validationErrors().length }} avvisi</span>
              <span class="pill">{{ state.publishChecklist().length }} controlli</span>
            </div>
          </div>

          <div class="preview-shell">
            @for (page of state.draft().pages; track page.id) {
              <article class="preview-page" [class.selected]="page.id === state.selectedPageId()">
                <header class="preview-page-head" (click)="state.setSelectedPage(page.id)">
                  <div>
                    <p class="preview-label">Pagina</p>
                    <h2>{{ page.title }}</h2>
                    <p>{{ page.summary }}</p>
                  </div>
                  <div class="preview-meta">
                    <span>{{ page.slug }}</span>
                    <span>{{ page.sections.length }} sezioni</span>
                  </div>
                </header>

                <div class="preview-sections">
                  @for (section of page.sections; track section.id) {
                    <section class="preview-section" [class.selected]="section.id === state.selectedSectionId()">
                      <button class="section-header" type="button" (click)="state.setSelectedSection(section.id)">
                        <span>{{ section.title }}</span>
                        <small>{{ section.purpose }}</small>
                      </button>

                      <div
                        class="section-grid"
                        cdkDropList
                        [cdkDropListData]="section.blocks"
                        (cdkDropListDropped)="reorderBlocks($event, section.id)">
                        @for (block of section.blocks; track block.id) {
                          <button
                            cdkDrag
                            type="button"
                            class="preview-block"
                            [class.selected]="block.id === state.selectedBlockId()"
                            (click)="state.setSelectedPage(page.id); state.setSelectedSection(section.id); state.setSelectedBlock(block.id)">
                            <div class="block-top">
                              <strong>{{ block.title }}</strong>
                              <span>{{ block.type }}</span>
                            </div>
                            <p>{{ block.body }}</p>
                            <div class="block-actions">
                              @if (block.ctaLabel) {
                                <span class="pill">{{ block.ctaLabel }}</span>
                              }
                              @if (block.assetIds?.length) {
                                <span class="pill">{{ block.assetIds?.length }} asset</span>
                              }
                            </div>
                          </button>
                        }
                      </div>
                    </section>
                  }
                </div>
              </article>
            }
          </div>
        </section>

        <aside class="panel inspector" [class.is-collapsed]="state.rightRailCollapsed()">
          <div class="panel-head">
            <div>
              <p class="card-label">Editor</p>
              <h3>Modifica quello che hai cliccato</h3>
            </div>
            <button mat-stroked-button type="button" (click)="state.toggleRightRail()">
              {{ state.rightRailCollapsed() ? 'Apri' : 'Riduci' }}
            </button>
          </div>

          @if (!state.rightRailCollapsed()) {
            <section class="inspector-block">
              <label>Nome coach</label>
              <input class="field" [ngModel]="state.draft().coachName" (ngModelChange)="state.updateDraft(draft => draft.coachName = $event)" />
              <label>Frase guida</label>
              <textarea class="field" rows="3" [ngModel]="state.draft().aiBrief" (ngModelChange)="state.updateDraft(draft => draft.aiBrief = $event)"></textarea>
            </section>

            <mat-divider></mat-divider>

            <section class="inspector-block">
              <label>Brand</label>
              <input class="field" [ngModel]="state.draft().theme.brandName" (ngModelChange)="state.updateTheme({ brandName: $event })" />
              <label>Colore principale</label>
              <input class="field" [ngModel]="state.draft().theme.primaryColor" (ngModelChange)="state.updateTheme({ primaryColor: $event })" />
              <label>Sfondo</label>
              <input class="field" [ngModel]="state.draft().theme.surfaceColor" (ngModelChange)="state.updateTheme({ surfaceColor: $event })" />
            </section>

            <mat-divider></mat-divider>

            <section class="inspector-block">
              <label>Titolo pagina</label>
              <input class="field" [ngModel]="state.selectedPage().title" (ngModelChange)="state.updateSelectedPage({ title: $event })" />
              <label>URL pagina</label>
              <input class="field" [ngModel]="state.selectedPage().slug" (ngModelChange)="state.updateSelectedPage({ slug: $event })" />
              <label>Titolo sezione</label>
              <input class="field" [ngModel]="state.selectedSection().title" (ngModelChange)="state.updateSelectedSection({ title: $event })" />
              <label>Titolo blocco</label>
              <input class="field" [ngModel]="state.selectedBlock().title" (ngModelChange)="state.updateSelectedBlock({ title: $event })" />
              <label>Testo blocco</label>
              <textarea class="field" rows="5" [ngModel]="state.selectedBlock().body" (ngModelChange)="state.updateSelectedBlock({ body: $event })"></textarea>
              <div class="field-row">
                <label>CTA</label>
                <input class="field" [ngModel]="state.selectedBlock().ctaLabel ?? ''" (ngModelChange)="state.updateSelectedBlock({ ctaLabel: $event })" />
              </div>
            </section>

            <section class="inspector-block">
              <div class="group-title">AI assistita</div>
              <textarea class="field" rows="4" [ngModel]="state.aiPrompt()" (ngModelChange)="state.setAiPrompt($event)"></textarea>
              <button mat-flat-button color="primary" type="button" (click)="state.applyAiPrompt(state.aiPrompt())">Applica suggerimento</button>
            </section>
          }
        </aside>
      </section>

      <section class="workspace-grid secondary">
        <mat-card class="panel">
          <p class="card-label">Controlli</p>
          <div class="workflow-list">
            @for (error of state.validationErrors(); track error.path) {
              <div><strong>{{ error.path }}</strong> {{ error.message }}</div>
            } @empty {
              <div>Nessun problema bloccante. Il sito è pronto per la preview.</div>
            }
          </div>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">Checklist</p>
          <div class="workflow-list">
            @for (item of state.publishChecklist(); track item) {
              <div>{{ item }}</div>
            }
          </div>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      :host { display: block; }
      .studio-shell { display: grid; gap: 1rem; }
      .workspace-grid {
        display: grid;
        grid-template-columns: minmax(280px, 0.82fr) minmax(0, 1.5fr) minmax(320px, 1fr);
        gap: 1rem;
        align-items: start;
      }
      .rail, .inspector { position: sticky; top: 1rem; }
      .rail.is-collapsed, .inspector.is-collapsed {
        max-width: 72px;
        overflow: hidden;
        padding-inline: 0.75rem;
      }
      .rail.is-collapsed .sidebar-group,
      .inspector.is-collapsed .inspector-block,
      .rail.is-collapsed .sidebar-item:not(.add-item),
      .rail.is-collapsed mat-divider,
      .inspector.is-collapsed mat-divider {
        display: none;
      }
      .guide-step, .sidebar-group, .inspector-block { display: grid; gap: 0.75rem; }
      .guide-panel {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .guide-step {
        padding: 0.95rem 1rem;
        border-radius: 1rem;
        background: rgba(255,255,255,.04);
      }
      .group-title, .card-label, .preview-label { text-transform: uppercase; letter-spacing: .08em; font-size: .72rem; opacity: .72; }
      .sidebar-item {
        width: 100%;
        justify-content: space-between;
        text-align: left;
        border-radius: .9rem;
        background: rgba(255,255,255,.04);
      }
      .sidebar-item.active { outline: 1px solid rgba(255,255,255,.18); }
      .add-item { justify-content: center; }
      .preview-shell { display: grid; gap: 1rem; }
      .preview-page, .preview-section, .preview-block {
        border-radius: 1rem;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.03);
      }
      .preview-page { padding: 1rem; }
      .preview-page.selected, .preview-section.selected, .preview-block.selected { outline: 2px solid rgba(217,108,6,.9); }
      .preview-page-head,
      .section-header,
      .preview-block {
        position: relative;
      }
      .preview-block::after,
      .section-header::after,
      .preview-page-head::after {
        content: 'click to edit';
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        font-size: 0.68rem;
        padding: 0.2rem 0.45rem;
        border-radius: 999px;
        background: rgba(17,24,39,.75);
        color: white;
        opacity: 0;
        transition: opacity .15s ease;
      }
      .preview-page-head:hover::after,
      .section-header:hover::after,
      .preview-block:hover::after { opacity: 1; }
      .preview-page-head, .section-header, .block-top, .block-actions, .field-row, .panel-head, .inline-actions {
        display: flex; gap: .75rem; align-items: center; justify-content: space-between;
      }
      .section-header, .preview-block { width: 100%; text-align: left; }
      .preview-sections { display: grid; gap: .75rem; margin-top: 1rem; }
      .preview-section { padding: .9rem; }
      .section-grid { display: grid; gap: .75rem; margin-top: .75rem; }
      .preview-block { padding: .9rem; cursor: pointer; }
      .pill {
        display: inline-flex;
        padding: .3rem .65rem;
        border-radius: 999px;
        background: rgba(255,255,255,.08);
      }
      .field {
        width: 100%;
        box-sizing: border-box;
        border-radius: .8rem;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.04);
        color: inherit;
        padding: .8rem .95rem;
      }
      .secondary { grid-template-columns: 1fr 1fr; }
      @media (max-width: 1200px) {
        .workspace-grid, .secondary, .guide-panel { grid-template-columns: 1fr; }
        .rail, .inspector { position: static; }
      }
    `,
  ],
})
export class StudioComponent {
  protected readonly state = inject(StudioStateService);
  protected readonly registry = COACH_BLOCK_REGISTRY;

  protected blockCount(): number {
    return this.state.draft().pages.reduce((total, page) => total + page.sections.reduce((sum, section) => sum + section.blocks.length, 0), 0);
  }

  protected trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  protected async copyDraftJson(): Promise<void> {
    await navigator.clipboard.writeText(this.state.exportDraftJson());
  }

  protected jumpToSelectedBlock(): void {
    const block = this.state.selectedBlock();
    if (block) this.state.setSelectedBlock(block.id);
  }

  protected reorderBlocks(event: CdkDragDrop<SiteBlock[]>, sectionId: string): void {
    this.state.updateDraft((draft) => {
      const section = draft.pages.find((page) => page.id === this.state.selectedPageId())?.sections.find((item) => item.id === sectionId);
      if (!section) return;
      section.blocks = this.state.moveArrayItem(section.blocks, event.previousIndex, event.currentIndex);
    });
  }
}
