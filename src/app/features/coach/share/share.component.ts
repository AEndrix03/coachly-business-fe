import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { shareAssets } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-share',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Share</p>
          <h2>Link, QR e share nativo per acquisizione organica.</h2>
        </div>
      </section>
      <section class="section-grid">
        @for (asset of shareAssets; track asset.label) {
          <mat-card class="info-card">
            <p class="card-label">{{ asset.label }}</p>
            <h3>{{ asset.value }}</h3>
          </mat-card>
        }
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class ShareComponent {
  protected readonly shareAssets = shareAssets;
}
