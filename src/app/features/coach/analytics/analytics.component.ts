import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { analyticsSnapshot } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-analytics',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Analytics</p>
          <h2>Visite, fonti, funnel e tag top performance.</h2>
        </div>
      </section>
      <section class="section-grid">
        <mat-card class="info-card">
          <p class="card-label">Visite</p>
          <h3>{{ analyticsSnapshot.visits }}</h3>
        </mat-card>
        <mat-card class="info-card">
          <p class="card-label">Traffico</p>
          <h3>{{ analyticsSnapshot.trafficSource }}</h3>
        </mat-card>
        <mat-card class="info-card">
          <p class="card-label">Funnel</p>
          <h3>{{ analyticsSnapshot.conversion }}</h3>
        </mat-card>
        <mat-card class="info-card">
          <p class="card-label">Top tag</p>
          <h3>{{ analyticsSnapshot.topTag }}</h3>
        </mat-card>
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class AnalyticsComponent {
  protected readonly analyticsSnapshot = analyticsSnapshot;
}
