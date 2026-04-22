import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { clientThreads } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-messages',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Messaggi</p>
          <h2>Thread con unread state e accesso rapido da dashboard e richieste.</h2>
        </div>
      </section>
      <section class="section-grid">
        @for (thread of clientThreads; track thread.name) {
          <mat-card class="info-card">
            <p class="card-label">{{ thread.state }}</p>
            <h3>{{ thread.name }}</h3>
            <p>{{ thread.preview }}</p>
            <div class="summary-row"><span>Update</span><strong>{{ thread.updatedAt }}</strong></div>
          </mat-card>
        }
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class MessagesComponent {
  protected readonly clientThreads = clientThreads;
}
