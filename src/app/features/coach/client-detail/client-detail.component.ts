import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { ClientDetailRouteData } from '../models/client-detail-route-data';

@Component({
  standalone: true,
  selector: 'app-coach-client-detail',
  imports: [MatButtonModule, MatCardModule, MatTabsModule, RouterLink],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Client detail</p>
          <h2>{{ client.name }} e il suo storico operativo.</h2>
        </div>
        <p class="lead compact">Progressi, piano, note coach e storico sessioni nello stesso punto.</p>
      </section>

      <mat-card class="panel">
        <p class="card-label">Client id</p>
        <h3>{{ clientId }}</h3>
        <mat-tab-group>
          <mat-tab label="Progressi">
            <p>{{ client.goal }} - aderenza {{ client.adherence }}%</p>
          </mat-tab>
          <mat-tab label="Piano">
            <p>Microciclo corrente, focus su recupero e carico progressivo.</p>
          </mat-tab>
          <mat-tab label="Note">
            <p>{{ client.note }}</p>
          </mat-tab>
          <mat-tab label="Sessioni">
            <p>Ultima sessione: {{ client.lastSession }}. Prossimo check-in: {{ client.nextCheckIn }}.</p>
          </mat-tab>
        </mat-tab-group>
      </mat-card>

      <section class="section-head">
        <a mat-button routerLink="/app/clients">Torna alla lista clienti</a>
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class ClientDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly clientDetail = this.route.snapshot.data['clientDetail'] as ClientDetailRouteData;
  protected readonly client = this.clientDetail.client;
  protected readonly clientId = this.client.id;
}
