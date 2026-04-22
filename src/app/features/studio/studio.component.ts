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
          <h1>Workspace operativo con tree, canvas, inspector e preview live.</h1>
          <p class="lead">
            Il builder edita un SiteDraft semantico. La preview usa il compile super-webflow solo per validazione e
            rendering, mentre l'AI resta un addon guidato.
          </p>
          <div class="actions">
            <button mat-flat-button color="primary" type="button">Autosave attivo</button>
            <button mat-stroked-button type="button">Preview gate</button>
            <button mat-stroked-button routerLink="/app/webflow" type="button">Compatibilità tecnica</button>
          </div>
        </div>

        <mat-card class="panel studio-summary">
          <p class="card-label">Draft</p>
          <h3>{{ state.draft().coachName }}</h3>
          <div class="summary-row"><span>Pages</span><strong>{{ state.draft().pages.length }}</strong></div>
          <div class="summary-row"><span>Locales</span><strong>{{ state.draft().localeVariants.length }}</strong></div>
          <div class="summary-row"><span>State</span><strong>{{ state.draft().publishState }}</strong></div>
          <div class="summary-row"><span>Updated</span><strong>{{ state.draft().updatedAt | date: 'shortTime' }}</strong></div>
        </mat-card>
      </section>

      <section class="workspace-grid">
        <aside class="panel rail">
          <div class="panel-head">
            <div>
              <p class="card-label">Outline</p>
              <h3>Pages and sections</h3>
            </div>
            <button mat-stroked-button type="button" (click)="state.addPage()">New page</button>
          </div>

          <div cdkDropList class="page-list" (cdkDropListDropped)="reorderPages($event)">
          @for (page of state.draft().pages; track page.id) {
            <article cdkDrag class="outline-page" [class.active]="page.id === state.selectedPageId()">
              <div class="outline-row">
                <button mat-button type="button" class="outline-title" (click)="state.setSelectedPage(page.id)">
                  {{ page.title }}
                </button>
                <button mat-icon-button type="button" (click)="state.removePage(page.id)" aria-label="Delete page">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              <label class="inline-edit">
                <span>Name</span>
                <input class="field" [ngModel]="page.title" (ngModelChange)="state.setSelectedPage(page.id); state.updateSelectedPage({ title: $event })" />
              </label>
              <label class="inline-edit">
                <span>Slug</span>
                <input class="field" [ngModel]="page.slug" (ngModelChange)="state.setSelectedPage(page.id); state.updateSelectedPage({ slug: $event })" />
              </label>
              <span class="muted">{{ page.summary }}</span>
              <div class="outline-actions">
                <button mat-button type="button" (click)="state.setSelectedPage(page.id)">Focus</button>
              </div>
              <div cdkDropList class="section-list" (cdkDropListDropped)="reorderSections($event, page.id)">
              @for (section of page.sections; track section.id) {
                <div cdkDrag class="outline-section" [class.active]="section.id === state.selectedSectionId()">
                  <div class="outline-row">
                    <button mat-button type="button" (click)="state.setSelectedSection(section.id)">
                      <mat-icon>segment</mat-icon>
                      <span>{{ section.title }}</span>
                    </button>
                    <div class="inline-actions">
                      <button mat-icon-button type="button" (click)="state.moveSection(section.id, -1)" aria-label="Move section up">
                        <mat-icon>arrow_upward</mat-icon>
                      </button>
                      <button mat-icon-button type="button" (click)="state.moveSection(section.id, 1)" aria-label="Move section down">
                        <mat-icon>arrow_downward</mat-icon>
                      </button>
                      <button mat-icon-button type="button" (click)="state.removeSection(section.id)" aria-label="Delete section">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  </div>
                  <label class="inline-edit">
                    <span>Section title</span>
                    <input class="field" [ngModel]="section.title" (ngModelChange)="state.setSelectedSection(section.id); state.updateSelectedSection({ title: $event })" />
                  </label>
                </div>
              }
              </div>
              <button mat-stroked-button type="button" (click)="state.addSection()">Add section</button>
            </article>
          }
          </div>
        </aside>

        <section class="panel canvas">
          <div class="panel-head">
            <div>
              <p class="card-label">Canvas</p>
              <h3>Live preview</h3>
            </div>
            <div class="inline-actions">
              <span class="pill">{{ state.validationErrors().length }} checks</span>
              <span class="pill">{{ state.publishChecklist().length }} publish items</span>
            </div>
          </div>
          <iframe class="studio-frame" [srcdoc]="state.previewHtml()" title="Studio preview"></iframe>
        </section>

        <aside class="panel inspector">
          <div class="panel-head">
            <div>
              <p class="card-label">Inspector</p>
              <h3>Selected node</h3>
            </div>
          </div>

          <section class="inspector-block">
            <label>Coach name</label>
            <input class="field" [ngModel]="state.draft().coachName" (ngModelChange)="state.updateDraft(draft => draft.coachName = $event)" />
            <label>AI brief</label>
            <textarea class="field" rows="4" [ngModel]="state.draft().aiBrief" (ngModelChange)="state.updateDraft(draft => draft.aiBrief = $event)"></textarea>
          </section>

          <mat-divider></mat-divider>

          <section class="inspector-block">
            <label>Theme brand</label>
            <input class="field" [ngModel]="state.draft().theme.brandName" (ngModelChange)="state.updateTheme({ brandName: $event })" />
            <label>Primary color</label>
            <input class="field" [ngModel]="state.draft().theme.primaryColor" (ngModelChange)="state.updateTheme({ primaryColor: $event })" />
            <label>Surface color</label>
            <input class="field" [ngModel]="state.draft().theme.surfaceColor" (ngModelChange)="state.updateTheme({ surfaceColor: $event })" />
          </section>

          <mat-divider></mat-divider>

          <section class="inspector-block">
            <label>Selected page title</label>
            <input class="field" [ngModel]="state.selectedPage().title" (ngModelChange)="state.updateSelectedPage({ title: $event })" />
            <label>Selected section title</label>
            <input class="field" [ngModel]="state.selectedSection().title" (ngModelChange)="state.updateSelectedSection({ title: $event })" />
            <label>Selected block title</label>
            <input class="field" [ngModel]="state.selectedBlock().title" (ngModelChange)="state.updateSelectedBlock({ title: $event })" />
            <label>Selected block body</label>
            <textarea class="field" rows="4" [ngModel]="state.selectedBlock().body" (ngModelChange)="state.updateSelectedBlock({ body: $event })"></textarea>
          </section>

          <section class="inspector-block">
            <div class="panel-head compact">
              <div>
                <p class="card-label">Blocks</p>
              </div>
            </div>
            @if (state.selectedSection(); as section) {
              <div cdkDropList class="block-list" (cdkDropListDropped)="reorderBlocks($event, section.id)">
              @for (block of section.blocks; track block.id) {
                <div cdkDrag class="block-card" [class.active]="block.id === state.selectedBlockId()">
                  <button mat-button type="button" (click)="state.setSelectedBlock(block.id)">
                    <span>{{ block.type }}</span>
                    <strong>{{ block.title }}</strong>
                  </button>
                  <div class="inline-actions">
                    <button mat-icon-button type="button" (click)="state.moveBlock(block.id, -1)" aria-label="Move block up">
                      <mat-icon>arrow_upward</mat-icon>
                    </button>
                    <button mat-icon-button type="button" (click)="state.moveBlock(block.id, 1)" aria-label="Move block down">
                      <mat-icon>arrow_downward</mat-icon>
                    </button>
                    <button mat-icon-button type="button" (click)="state.removeBlock(block.id)" aria-label="Delete block">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              }
              </div>
            }
          </section>

          <section class="inspector-block">
            <div class="panel-head compact">
              <div>
                <p class="card-label">Add block</p>
              </div>
            </div>
            <mat-chip-set class="chip-column">
              @for (block of registry; track block.type) {
                <mat-chip (click)="state.addBlock(block.type)">{{ block.label }}</mat-chip>
              }
            </mat-chip-set>
          </section>

          <section class="inspector-block">
            <div class="panel-head compact">
              <div>
                <p class="card-label">AI addon</p>
              </div>
            </div>
            <textarea class="field" rows="4" [ngModel]="state.aiPrompt()" (ngModelChange)="state.setAiPrompt($event)"></textarea>
            <button mat-flat-button color="primary" type="button" (click)="state.applyAiPrompt(state.aiPrompt())">Apply</button>
          </section>
        </aside>
      </section>

      <section class="workspace-grid secondary">
        <mat-card class="panel">
          <p class="card-label">Publish checklist</p>
          <div class="workflow-list">
            @for (item of state.publishChecklist(); track item) {
              <div>{{ item }}</div>
            }
          </div>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">Validation</p>
          @if (state.validationErrors().length === 0) {
            <p class="lead compact">No blocking issues. The draft is ready for preview compilation.</p>
          } @else {
            <div class="workflow-list">
              @for (error of state.validationErrors(); track error.path) {
                <div><strong>{{ error.path }}</strong> {{ error.message }}</div>
              }
            </div>
          }
          <mat-divider></mat-divider>
          <p class="lead compact">Preview uses the compiled super-webflow document. Editing stays local-first and deterministic.</p>
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
        grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.6fr) minmax(320px, 1fr);
        gap: 1rem;
        align-items: start;
      }
      .rail, .inspector { position: sticky; top: 1rem; }
      .canvas { min-width: 0; }
      .studio-frame {
        width: 100%;
        min-height: 78vh;
        border: 0;
        border-radius: 1rem;
        background: #0b1220;
      }
      .outline-page, .outline-section, .inspector-block { display: grid; gap: 0.6rem; margin-bottom: 1rem; }
      .outline-page { padding: 0.75rem; border-radius: 1rem; background: rgba(255,255,255,.03); }
      .outline-page.active, .outline-section.active { outline: 1px solid rgba(255,255,255,.16); }
      .outline-row, .panel-head, .inline-actions { display: flex; align-items: center; gap: 0.5rem; justify-content: space-between; }
      .outline-title { justify-content: flex-start; }
      .field {
        width: 100%;
        box-sizing: border-box;
        border-radius: 0.8rem;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.04);
        color: inherit;
        padding: 0.8rem 0.95rem;
      }
      .pill {
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: rgba(255,255,255,.08);
      }
      .muted { color: rgba(255,255,255,.68); }
      .secondary { grid-template-columns: 1fr 1fr; }
      .page-list, .section-list, .block-list { display: grid; gap: 0.75rem; }
      .inline-edit { display: grid; gap: 0.35rem; }
      .block-card {
        display: grid;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 0.9rem;
        background: rgba(255,255,255,.04);
      }
      @media (max-width: 1200px) {
        .workspace-grid, .secondary { grid-template-columns: 1fr; }
        .rail, .inspector { position: static; }
      }
    `,
  ],
})
export class StudioComponent {
  protected readonly state = inject(StudioStateService);
  protected readonly registry = COACH_BLOCK_REGISTRY;

  protected reorderPages(event: CdkDragDrop<unknown>): void {
    this.state.updateDraft((draft) => {
      draft.pages = this.state.moveArrayItem(draft.pages, event.previousIndex, event.currentIndex);
    });
  }

  protected reorderSections(event: CdkDragDrop<unknown>, pageId: string): void {
    this.state.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === pageId);
      if (!page) return;
      page.sections = this.state.moveArrayItem(page.sections, event.previousIndex, event.currentIndex);
    });
  }

  protected reorderBlocks(event: CdkDragDrop<unknown>, sectionId: string): void {
    this.state.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === this.state.selectedPageId())?.sections.find((item) => item.id === sectionId);
      if (!section) return;
      section.blocks = this.state.moveArrayItem(section.blocks, event.previousIndex, event.currentIndex);
    });
  }
}
