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
      <section class="hero hero-public">
        <div class="hero-copy">
          <p class="hero-kicker">Coachly public page</p>
          <h1>La pagina coach che fa capire subito chi sei e cosa fai.</h1>
          <p class="lead">
            Una landing pensata per convertire: bio, risultati, servizi, prova sociale e CTA sempre leggibili. Su
            telefono resta ordinata, rapida da scansionare e forte visivamente.
          </p>

          <div class="actions">
            <button mat-flat-button color="primary">Apri il profilo</button>
            <button mat-stroked-button>Esplora i blocchi</button>
          </div>

          <div class="hero-pills">
            @for (tag of publicHighlights; track tag) {
              <span class="pill">{{ tag }}</span>
            }
          </div>
        </div>

        <mat-card class="hero-card hero-preview">
          <div class="preview-top">
            <div>
              <p class="card-label">Live preview</p>
              <h3>Coach profile that sells</h3>
            </div>
            <span class="status-dot">Available</span>
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
          <h2>Blocchi chiari, modulari e pronti per le idee del coach.</h2>
        </div>
        <p class="lead compact">
          Questa home mostra il valore del coach in modo diretto e lascia spazio ai contenuti che arrivano da
          \`coach idea.txt\`: public page, dashboard, clienti, analytics e share tools.
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
  `,
})
export class PublicPageComponent {
  protected readonly publicHighlights = ['Hero', 'Bio', 'Servizi', 'FAQ'];
  protected readonly heroMetrics = [
    { value: '+31%', label: 'lead to contact', icon: 'trending_up' },
    { value: '2m 14s', label: 'tempo medio sulla pagina', icon: 'timer' },
    { value: '8 blocchi', label: 'componenti disponibili', icon: 'view_quilt' },
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
