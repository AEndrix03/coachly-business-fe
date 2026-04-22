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
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Coach public page</p>
          <h1>Una pagina pubblica pensata per convertire visite in clienti, non solo per presentarsi.</h1>
          <p class="lead">
            Sistema a blocchi, CTA chiare, visibilita free / pro e contenuti che il coach puo condividere ovunque senza
            toccare login o backend.
          </p>

          <div class="actions">
            <button mat-flat-button color="primary">Apri preview</button>
            <button mat-stroked-button>Configura blocchi</button>
          </div>

          <mat-chip-set class="chip-row">
            @for (tag of publicHighlights; track tag) {
              <mat-chip>{{ tag }}</mat-chip>
            }
          </mat-chip-set>
        </div>

        <mat-card class="hero-card">
          <p class="card-label">Conversion snapshot</p>
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

      <section class="section-grid">
        @for (block of publicBlocks; track block.title) {
          <mat-card class="info-card">
            <mat-icon>{{ block.icon }}</mat-icon>
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
  protected readonly publicHighlights = ['Hero', 'Bio', 'Pricing', 'FAQ'];
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
