import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { priorityClients } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-clients',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Clienti</p>
          <h2>Lista clienti con stato, aderenza e accesso al dettaglio.</h2>
        </div>
        <p class="lead compact">Un click porta al profilo completo, alle note e allo storico sessioni.</p>
      </section>

      <section class="section-grid">
        @for (client of priorityClients; track client.id) {
          <mat-card class="info-card">
            <p class="card-label">{{ client.status }}</p>
            <h3>{{ client.name }}</h3>
            <p>{{ client.goal }}</p>
            <div class="summary-row"><span>Aderenza</span><strong>{{ client.adherence }}%</strong></div>
            <a mat-button [routerLink]="['/app/clients', client.id]">Apri dettaglio</a>
          </mat-card>
        }
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class ClientsComponent {
  protected readonly priorityClients = priorityClients;
}
