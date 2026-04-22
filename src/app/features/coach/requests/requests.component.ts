import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { clientRequests } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-requests',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Richieste</p>
          <h2>Accetta, rifiuta o lascia in attesa.</h2>
        </div>
      </section>
      <section class="section-grid">
        @for (request of clientRequests; track request.name) {
          <mat-card class="info-card">
            <p class="card-label">{{ request.status }}</p>
            <h3>{{ request.name }}</h3>
            <p>{{ request.reason }}</p>
            <div class="summary-row"><span>Arrivo</span><strong>{{ request.arrival }}</strong></div>
          </mat-card>
        }
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class RequestsComponent {
  protected readonly clientRequests = clientRequests;
}
