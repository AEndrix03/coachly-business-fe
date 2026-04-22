import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { COACH_BLOCK_REGISTRY } from './models/block-registry.models';
import { StudioAiService } from './services/studio-ai.service';
import { StudioPreviewService } from './services/studio-preview.service';

@Component({
  standalone: true,
  selector: 'app-studio',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatIconModule],
  template: `
    <main class="page page-studio">
      <section class="hero studio-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Coach custom site studio</p>
          <h1>Authoring semantico, preview affidabile, AI controllata.</h1>
          <p class="lead">
            Il builder modifica un SiteDraft, non HTML libero. Il compile finale produce il documento super-webflow
            da validare e renderizzare.
          </p>
          <div class="actions">
            <button mat-flat-button color="primary" type="button">Autosave attivo</button>
            <button mat-stroked-button type="button">Publish gate</button>
          </div>
        </div>

        <mat-card class="panel studio-summary">
          <p class="card-label">Draft</p>
          <h3>{{ draft.coachName }}</h3>
          <div class="summary-row"><span>Pages</span><strong>{{ draft.pages.length }}</strong></div>
          <div class="summary-row"><span>Locales</span><strong>{{ draft.localeVariants.length }}</strong></div>
          <div class="summary-row"><span>State</span><strong>{{ draft.publishState }}</strong></div>
        </mat-card>
      </section>

      <section class="studio-grid">
        <mat-card class="panel">
          <p class="card-label">Outline</p>
          @for (page of draft.pages; track page.id) {
            <div class="outline-page">
              <strong>{{ page.title }}</strong>
              <span>{{ page.summary }}</span>
              @for (section of page.sections; track section.id) {
                <div class="outline-section">
                  <mat-icon>segment</mat-icon>
                  <span>{{ section.title }} · {{ section.purpose }}</span>
                </div>
              }
            </div>
          }
        </mat-card>

        <mat-card class="panel panel-canvas">
          <p class="card-label">Canvas preview</p>
          <iframe class="studio-frame" [srcdoc]="previewHtml" title="Studio preview"></iframe>
        </mat-card>

        <mat-card class="panel">
          <p class="card-label">Inspector + AI</p>
          <h3>Block registry</h3>
          <mat-chip-set class="chip-column">
            @for (block of registry; track block.type) {
              <mat-chip>{{ block.label }} · {{ block.type }}</mat-chip>
            }
          </mat-chip-set>
          <mat-divider></mat-divider>
          <h3>AI patches</h3>
          @for (patch of aiPatches; track patch.summary) {
            <div class="patch-card">
              <strong>{{ patch.action }}</strong>
              <span>{{ patch.summary }}</span>
              @for (change of patch.changes; track change) {
                <div class="patch-item">{{ change }}</div>
              }
            </div>
          }
        </mat-card>
      </section>

      <section class="studio-grid secondary">
        <mat-card class="panel">
          <p class="card-label">Publish checklist</p>
          <div class="workflow-list">
            <div>Schema validity via super-webflow</div>
            <div>Semantic validation in browser</div>
            <div>SEO minima and trust badge present</div>
            <div>Locale completeness and rollback snapshot</div>
          </div>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">Runtime note</p>
          <p class="lead compact">
            Preview uses the compiled super-webflow document. Editing stays on the semantic model to keep the builder
            deterministic and safe.
          </p>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .studio-grid {
        display: grid;
        grid-template-columns: 280px minmax(0, 1.4fr) minmax(320px, 0.9fr);
        gap: 1rem;
        align-items: start;
      }
      .studio-frame {
        width: 100%;
        min-height: 760px;
        border: 0;
        border-radius: 1rem;
        background: #0b1220;
      }
      .patch-card, .outline-page { display: grid; gap: 0.5rem; margin-bottom: 1rem; }
      .outline-section, .patch-item { display: flex; gap: 0.5rem; align-items: center; color: rgba(255,255,255,.72); }
      @media (max-width: 1200px) {
        .studio-grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class StudioComponent {
  private readonly previewService = inject(StudioPreviewService);
  private readonly aiService = inject(StudioAiService);

  protected readonly draft = this.previewService.getDraft();
  protected readonly registry = COACH_BLOCK_REGISTRY;
  protected readonly aiPatches = this.aiService.buildPlan(this.draft);
  protected readonly previewHtml = this.previewService.render();
}

