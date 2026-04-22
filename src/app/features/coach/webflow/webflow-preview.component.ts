import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { CoachWebflowService } from './coach-webflow.service';

@Component({
  standalone: true,
  selector: 'app-coach-webflow-preview',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink],
  template: `
    <main class="page page-dashboard">
      <section class="hero dashboard-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Super Webflow runtime</p>
          <h1>Template coach validato e renderizzato dalla libreria clonata.</h1>
          <p class="lead">
            Qui coachly-business-fe consuma il runtime multi-linguaggio di super-webflow come motore per il futuro
            custom website: validazione schema, data binding e HTML preview.
          </p>
          <div class="actions">
            <button mat-flat-button color="primary" type="button" (click)="refresh()">Rigenera preview</button>
            <button mat-stroked-button type="button" routerLink="/app/upgrade">Sblocca Pro</button>
          </div>
          <div class="hero-pills">
            <span class="pill">validator</span>
            <span class="pill">engine</span>
            <span class="pill">html adapter</span>
          </div>
        </div>

        <mat-card class="panel coach-surface coach-panel">
          <p class="card-label">Validation</p>
          <h3>{{ errorCount === 0 ? 'Template valido' : 'Template con errori' }}</h3>
          <mat-chip-set class="chip-column">
            @for (error of errors; track error.path) {
              <mat-chip class="coach-tag is-danger">{{ error.path }}: {{ error.message }}</mat-chip>
            }
            @if (errors.length === 0) {
              <mat-chip class="coach-tag is-success">No schema or semantic errors</mat-chip>
            }
          </mat-chip-set>
        </mat-card>
      </section>

      <section class="dashboard-layout secondary">
        <mat-card class="panel">
          <p class="card-label">Integration notes</p>
          <div class="workflow-list">
            <div>Use validateDocument before render</div>
            <div>Feed DataContext with coach preview data</div>
            <div>Render via HtmlAdapter inside an iframe</div>
          </div>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">Preview</p>
          <iframe class="webflow-frame" [srcdoc]="previewHtml" title="Coach Webflow preview"></iframe>
        </mat-card>
      </section>
    </main>
  `,
  styles: [
    `
      .webflow-frame {
        width: 100%;
        min-height: 720px;
        border: 0;
        border-radius: 1rem;
        background: #0b1220;
      }
    `,
  ],
})
export class WebflowPreviewComponent implements OnInit {
  private readonly service = inject(CoachWebflowService);

  protected errors = this.service.validate();
  protected previewHtml = '';
  protected errorCount = this.errors.length;

  ngOnInit(): void {
    this.previewHtml = this.service.render();
  }

  refresh(): void {
    this.errors = this.service.validate();
    this.errorCount = this.errors.length;
    this.previewHtml = this.service.render();
  }
}
