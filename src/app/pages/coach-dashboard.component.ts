import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-coach-dashboard',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatIconModule],
  template: `
    <main class="page page-dashboard">
      <section class="hero dashboard-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Coach control room</p>
          <h1>Una dashboard compatta che regge bene anche sul telefono.</h1>
          <p class="lead">
            Feed operativo, clienti in difficolta e segnali di crescita stanno nella stessa schermata. La UI resta
            pulita anche quando i dati diventano piu densi.
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
            <button mat-stroked-button>Apri timeline</button>
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
            @for (item of priorityClients; track item) {
              <mat-chip>{{ item }}</mat-chip>
            }
          </mat-chip-set>
        </mat-card>
      </section>

      <section class="dashboard-layout secondary">
        <mat-card class="panel">
          <p class="card-label">Workflow</p>
          <h3>Blocchi privati e azioni rapide</h3>
          <div class="workflow-list">
            <div>Client detail con progressi e storico sessioni</div>
            <div>Messaggi e richieste client / coach</div>
            <div>Analytics e alert automatici</div>
          </div>
        </mat-card>

        <mat-card class="panel">
          <p class="card-label">Focus</p>
          <h3>Dashboard che riduce il rumore</h3>
          <p class="lead compact">
            Il layout privilegia priorita, leggibilita e scan rapido, lasciando spazio ai moduli avanzati quando
            serviranno.
          </p>
          <mat-divider></mat-divider>
          <div class="summary-row">
            <span>Visite profilo</span>
            <strong>+18% WoW</strong>
          </div>
        </mat-card>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CoachDashboardComponent {
  protected readonly dashboardMetrics = [
    { value: '18', label: 'Clienti attivi', icon: 'groups' },
    { value: '6', label: 'Alert', icon: 'warning' },
    { value: '24', label: 'Richieste', icon: 'inbox' },
  ];

  protected readonly activityFeed = [
    'Luca B. ha completato Panca Piana 4x10',
    'Sara ha saltato 2 sessioni questa settimana',
    'Nuovo lead da pagina pubblica',
  ];

  protected readonly priorityClients = [
    'Marco R. - aderenza 62%',
    'Giulia T. - check-in in ritardo',
    'Nina S. - PR nuovo sul deadlift',
  ];
}
