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
          <p class="eyebrow">Public profile</p>
          <h1>Una vetrina premium che fa percepire valore prima ancora della dashboard.</h1>
          <p class="lead">
            Design editoriale, blocchi modulari e CTA molto visibili per trasformare la pagina pubblica del coach in
            un punto di conversione credibile, elegante e facile da leggere su mobile.
          </p>

          <div class="actions">
            <button mat-flat-button color="primary">Apri preview</button>
            <button mat-stroked-button>Esplora blocchi</button>
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
              <p class="card-label">Coach profile</p>
              <h3>Preview live</h3>
            </div>
            <span class="status-dot">Online</span>
          </div>

          <div class="profile-surface">
            <div class="profile-avatar">CB</div>
            <div class="profile-meta">
              <strong>Coach Business</strong>
              <span>Strength, mobility e performance</span>
            </div>
          </div>

          <div class="metric-stack">
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
          <p class="eyebrow">What the page does</p>
          <h2>Chiarezza visiva, fiducia e acquisizione in un solo layout.</h2>
        </div>
        <p class="lead compact">
          Ogni blocco e pensato per funzionare bene su desktop e telefono, con contenuti facili da scansionare e CTA
          sempre accessibili.
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
      description: 'Statistiche, risultati e segnali di fiducia in evidenza nella prima schermata.',
    },
    {
      icon: 'category',
      title: 'Block composer',
      description: 'Layout modulare con CTA, gallery, sample workout, FAQ e contenuti bloccati Pro.',
    },
    {
      icon: 'share',
      title: 'Distribuzione',
      description: 'QR, link breve e card social per portare traffico dalla bio del coach alla pagina.',
    },
  ];
}
