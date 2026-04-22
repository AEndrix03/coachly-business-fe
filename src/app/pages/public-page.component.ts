import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-public-page',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <main class="page page-public">
      <section class="hero hero-public hero-impact">
        <div class="hero-backdrop" aria-hidden="true"></div>
        <div class="hero-copy">
          <p class="hero-kicker">Coachly entry screen</p>
          <h1>Prima impressione feroce. Valore subito. CTA impossibile da ignorare.</h1>
          <p class="lead">
            Questa e la pagina che il cliente vede appena entra in app: impatto visivo alto, messaggio netto, blocchi
            ordinati e una gerarchia pensata per vendere il coach in pochi secondi.
          </p>

          <div class="actions">
            <button mat-flat-button color="primary">Apri il profilo ora</button>
            <button mat-stroked-button>Guarda i blocchi</button>
          </div>

          <div class="hero-pills">
            @for (tag of publicHighlights; track tag) {
              <span class="pill">{{ tag }}</span>
            }
          </div>
        </div>

        <mat-card class="hero-card hero-preview hero-panel">
          <div class="preview-top">
            <div>
              <p class="card-label">Live preview</p>
              <h3>Coach profile that hits hard</h3>
            </div>
            <span class="status-dot">Open now</span>
          </div>

          <div class="profile-surface">
            <div class="profile-avatar">CB</div>
            <div class="profile-meta">
              <strong>Coach Business</strong>
              <span>Strength, mobility e performance</span>
            </div>
          </div>

          <div class="snapshot-grid">
            @for (metric of heroMetrics; track metric.label) {
              <div class="snapshot-item">
                <mat-icon>{{ metric.icon }}</mat-icon>
                <strong>{{ metric.value }}</strong>
                <span>{{ metric.label }}</span>
              </div>
            }
          </div>
        </mat-card>
      </section>

      <section class="section-head">
        <div>
          <p class="eyebrow">Coach ideas</p>
          <h2>Un sistema che prende le idee del coach e le trasforma in conversione.</h2>
        </div>
        <p class="lead compact">
          La struttura segue le idee in \`coach idea.txt\`: public page, dashboard, clienti, analytics e share
          tools, ma la prima schermata resta il punto di shock visivo.
        </p>
      </section>

      <section class="section-grid">
        @for (block of publicBlocks; track block.title) {
          <mat-card class="info-card">
            <div class="icon-badge">
              <mat-icon>{{ block.icon }}</mat-icon>
            </div>
            <h3>{{ block.title }}</h3>
            <p>{{ block.description }}</p>
          </mat-card>
        }
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero-impact {
      align-items: stretch;
      min-height: min(84vh, 760px);
    }

    .hero-backdrop {
      position: absolute;
      inset: -1.5rem -1rem auto auto;
      width: min(48vw, 540px);
      height: min(48vw, 540px);
      border-radius: 32% 68% 61% 39% / 45% 31% 69% 55%;
      background:
        radial-gradient(circle at 28% 28%, rgba(96, 165, 250, 0.42), transparent 34%),
        radial-gradient(circle at 75% 28%, rgba(14, 165, 233, 0.34), transparent 28%),
        radial-gradient(circle at 55% 70%, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.98) 60%);
      box-shadow:
        0 24px 90px rgba(37, 99, 235, 0.18),
        inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      opacity: 0.95;
      filter: saturate(1.05);
      pointer-events: none;
    }

    .hero-panel {
      border-color: rgba(37, 99, 235, 0.14);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 251, 255, 0.88)),
        linear-gradient(135deg, rgba(37, 99, 235, 0.06), transparent 40%);
    }
  `,
})
export class PublicPageComponent {
  protected readonly publicHighlights = ['Hero', 'Bio', 'Prova sociale', 'CTA', 'FAQ'];
  protected readonly heroMetrics = [
    { value: '+31%', label: 'lead to contact', icon: 'trending_up' },
    { value: '2m 14s', label: 'tempo medio', icon: 'timer' },
    { value: '8 blocchi', label: 'moduli disponibili', icon: 'view_quilt' },
  ];
  protected readonly publicBlocks = [
    {
      icon: 'insights',
      title: 'Proof layer',
      description: 'Statistiche, risultati e segnali di fiducia nella prima schermata, senza appesantire il layout.',
    },
    {
      icon: 'category',
      title: 'Block composer',
      description: 'Layout modulare con CTA, gallery, FAQ, sample workout e contenuti Pro bloccati.',
    },
    {
      icon: 'share',
      title: 'Distribution',
      description: 'QR, link breve e card social per trasformare il profilo in un funnel condivisibile.',
    },
  ];
}
