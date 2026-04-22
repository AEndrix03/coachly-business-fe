import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { activityFeed, dashboardMetrics, priorityClients } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-dashboard',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatIconModule, RouterLink],
  template: `
    <main class="page page-dashboard">
      <section class="hero dashboard-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Coach control room</p>
          <h1>Una dashboard densa, ma leggibile anche sul telefono.</h1>
          <p class="lead">
            KPI, alert, richieste, clienti prioritari e azioni rapide nella stessa schermata. Il sistema riduce il
            rumore e mostra solo il prossimo passo utile.
          </p>
        </div>

        <div class="stats-strip">
          @for (metric of dashboardMetrics; track metric.label) {
            <mat-card class="stat-card">
              <mat-icon>{{ metric.icon }}</mat-icon>
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </mat-card>
          }
        </div>
      </section>

      <section class="dashboard-layout">
        <mat-card class="panel panel-wide">
          <div class="panel-head">
            <div>
              <p class="card-label">Activity feed</p>
              <h3>Ultime azioni rilevanti</h3>
            </div>
            <button mat-stroked-button routerLink="/app/messages">Apri messaggi</button>
          </div>
          <div class="feed-list">
            @for (item of activityFeed; track item) {
              <div class="feed-item">
                <mat-icon>radio_button_checked</mat-icon>
                <span>{{ item }}</span>
              </div>
            }
          </div>
        </mat-card>

        <mat-card class="panel">
          <p class="card-label">Priorita</p>
          <h3>Clienti da seguire</h3>
          <mat-chip-set class="chip-column">
            @for (client of priorityClients; track client.id) {
              <mat-chip>{{ client.name }} - {{ client.adherence }}%</mat-chip>
            }
          </mat-chip-set>
        </mat-card>
      </section>

      <section class="dashboard-layout secondary">
        <mat-card class="panel">
          <p class="card-label">Workflow</p>
          <h3>Azioni rapide</h3>
          <div class="workflow-list">
            <div><a routerLink="/app/clients">Lista clienti</a></div>
            <div><a routerLink="/app/requests">Richieste nuove</a></div>
            <div><a routerLink="/app/analytics">Analytics e funnel</a></div>
            <div><a routerLink="/app/studio">Custom site studio</a></div>
            <div><a routerLink="/app/webflow">Webflow preview</a></div>
          </div>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">Focus</p>
          <h3>Dal segnale all'azione</h3>
          <p class="lead compact">Ogni card porta a una schermata operativa precisa, non a un altro layer di rumore.</p>
          <mat-divider></mat-divider>
          <div class="summary-row">
            <span>Visite profilo</span>
            <strong>+18% WoW</strong>
          </div>
        </mat-card>
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class CoachDashboardComponent {
  protected readonly dashboardMetrics = dashboardMetrics;
  protected readonly activityFeed = activityFeed;
  protected readonly priorityClients = priorityClients;
}
