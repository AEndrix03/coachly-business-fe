import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { STUDIO_PROJECTS } from './studio.catalog';

@Component({
  standalone: true,
  selector: 'app-studio-chooser',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  template: `
    <main class="chooser-shell">
      <section class="hero-slab">
        <div class="hero-copy">
          <p class="eyebrow">Studio front door</p>
          <h1>Project chooser first. Editor second.</h1>
          <p class="lead">
            The studio now behaves like a real design tool: select a project and a page, then enter a dedicated
            full-screen workspace that keeps selection and route state in sync.
          </p>
          <div class="hero-actions">
            <a mat-flat-button color="primary" [routerLink]="['/app/studio', projects[0].id, projects[0].draft.pages[0].id]">
              Open main studio
            </a>
            <a mat-stroked-button routerLink="/app">Back to workspace</a>
          </div>
        </div>

        <div class="hero-preview">
          <div class="preview-stack">
            <div class="preview-card preview-primary">
              <span class="preview-label">Studio projects</span>
              <strong>{{ projects.length }}</strong>
              <small>Local catalog, route-backed state</small>
            </div>
            <div class="preview-card">
              <span class="preview-label">Canvas</span>
              <strong>Figma-like</strong>
              <small>Layers, design, prototype, AI</small>
            </div>
            <div class="preview-card">
              <span class="preview-label">Workflow</span>
              <strong>2 steps</strong>
              <small>Chooser then dedicated workspace</small>
            </div>
          </div>
        </div>
      </section>

      <section class="catalog-grid">
        @for (project of projects; track project.id) {
          <mat-card class="project-card" [style.--project-accent]="project.accent">
            <div class="card-topline"></div>
            <div class="project-head">
              <div class="project-title">
                <p class="card-label">Project</p>
                <h3>{{ project.name }}</h3>
                <p class="card-summary">{{ project.description }}</p>
              </div>
              <span class="status-pill">{{ project.status }}</span>
            </div>

            <div class="project-metrics">
              <div class="metric">
                <span>Owner</span>
                <strong>{{ project.owner }}</strong>
              </div>
              <div class="metric">
                <span>Pages</span>
                <strong>{{ project.draft.pages.length }}</strong>
              </div>
              <div class="metric">
                <span>Theme</span>
                <strong>{{ project.draft.theme.brandName }}</strong>
              </div>
            </div>

            <div class="page-list">
              @for (page of project.draft.pages; track page.id) {
                <a class="page-row" [routerLink]="['/app/studio', project.id, page.id]">
                  <div>
                    <strong>{{ page.title }}</strong>
                    <small>{{ page.summary }}</small>
                  </div>
                  <span class="page-slug">{{ page.slug }}</span>
                </a>
              }
            </div>

            <div class="project-footer">
              <div class="pill-row">
                @for (page of project.draft.pages.slice(0, 3); track page.id) {
                  <span class="mini-pill">{{ page.title }}</span>
                }
              </div>
              <a mat-flat-button color="primary" [routerLink]="['/app/studio', project.id, project.draft.pages[0].id]">
                Enter workspace
              </a>
            </div>
          </mat-card>
        }
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; }
    .chooser-shell {
      min-height: 100vh;
      padding: 1.5rem;
      color: #e2e8f0;
      background:
        radial-gradient(circle at 12% 12%, rgba(59, 130, 246, 0.2), transparent 28%),
        radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.16), transparent 25%),
        linear-gradient(180deg, #020617 0%, #0f172a 50%, #f8fafc 50%, #eef2ff 100%);
    }
    .hero-slab {
      display: grid;
      gap: 1rem;
      grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
      align-items: stretch;
      margin-bottom: 1.25rem;
    }
    .hero-copy,
    .hero-preview {
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 1.6rem;
      background: rgba(15, 23, 42, 0.62);
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 80px rgba(2, 6, 23, 0.35);
    }
    .hero-copy { padding: clamp(1.4rem, 2vw, 2.1rem); display: grid; align-content: space-between; gap: 1.5rem; }
    .hero-copy h1 {
      margin: 0;
      max-width: 10ch;
      color: #f8fafc;
      font-family: 'Sora', sans-serif;
      font-size: clamp(2.7rem, 6vw, 5.8rem);
      line-height: 0.92;
      letter-spacing: -0.07em;
    }
    .lead {
      margin: 0;
      max-width: 58ch;
      color: rgba(226, 232, 240, 0.78);
    }
    .hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .hero-preview { padding: 1.2rem; display: grid; }
    .preview-stack { display: grid; gap: 0.75rem; }
    .preview-card {
      padding: 1rem 1.05rem;
      border-radius: 1.2rem;
      background: rgba(248, 250, 252, 0.92);
      color: #0f172a;
      display: grid;
      gap: 0.45rem;
    }
    .preview-primary {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.94), rgba(15, 118, 110, 0.94));
      color: #fff;
      min-height: 12rem;
      align-content: end;
    }
    .preview-primary strong { font-size: 2.6rem; font-family: 'Sora', sans-serif; line-height: 0.95; }
    .preview-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.18em; opacity: 0.72; }
    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }
    .project-card {
      position: relative;
      overflow: hidden;
      padding: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.16);
      border-radius: 1.45rem;
      background: rgba(255, 255, 255, 0.84);
      color: #0f172a;
      box-shadow: 0 18px 50px rgba(15, 23, 42, 0.12);
    }
    .card-topline {
      height: 0.3rem;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--project-accent), color-mix(in srgb, var(--project-accent) 35%, white));
      margin-bottom: 1rem;
    }
    .project-head { display: flex; justify-content: space-between; gap: 1rem; align-items: start; }
    .project-title { display: grid; gap: 0.35rem; }
    .project-title h3 { margin: 0; font-family: 'Sora', sans-serif; font-size: 1.4rem; letter-spacing: -0.04em; }
    .card-summary { margin: 0; color: #475569; max-width: 40ch; }
    .project-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.65rem;
      margin: 1rem 0;
    }
    .metric {
      display: grid;
      gap: 0.2rem;
      padding: 0.8rem;
      border-radius: 1rem;
      background: rgba(248, 250, 252, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }
    .metric span { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; }
    .metric strong { font-size: 0.96rem; color: #0f172a; }
    .page-list { display: grid; gap: 0.55rem; }
    .page-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      text-decoration: none;
      padding: 0.9rem 0.95rem;
      border-radius: 1rem;
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: rgba(248, 250, 252, 0.92);
      transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }
    .page-row:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--project-accent) 50%, white);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }
    .page-row div { display: grid; gap: 0.15rem; }
    .page-row strong { font-size: 0.96rem; }
    .page-row small { color: #64748b; }
    .page-slug {
      padding: 0.35rem 0.6rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--project-accent) 12%, white);
      color: var(--project-accent);
      font-size: 0.74rem;
      font-weight: 800;
    }
    .project-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(148, 163, 184, 0.16);
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill-row { display: flex; gap: 0.45rem; flex-wrap: wrap; }
    .mini-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.65rem;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.06);
      color: #334155;
      font-size: 0.74rem;
      font-weight: 700;
    }
    .status-pill {
      padding: 0.35rem 0.7rem;
      border-radius: 999px;
      background: #0f172a;
      color: white;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      white-space: nowrap;
    }
  `],
})
export class StudioChooserComponent {
  protected readonly projects = STUDIO_PROJECTS;
}
