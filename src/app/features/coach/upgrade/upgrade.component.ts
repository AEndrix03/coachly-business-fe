import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-coach-upgrade',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Pro</p>
          <h2>Upsell con pricing mensile, annuale e trial.</h2>
        </div>
      </section>
      <section class="section-grid">
        @for (plan of plans; track plan.label) {
          <mat-card class="info-card">
            <p class="card-label">{{ plan.label }}</p>
            <h3>{{ plan.price }}</h3>
            <p>{{ plan.description }}</p>
          </mat-card>
        }
      </section>

      <mat-card class="panel" style="margin-top: 1.2rem">
        <p class="card-label">Benefit</p>
        <div class="workflow-list">
          <div>Blocchi premium nel public profile</div>
          <div>Analytics avanzate e funnel</div>
          <div>QR, share nativo e social capture</div>
        </div>
      </mat-card>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class UpgradeComponent {
  protected readonly plans = [
    { label: 'Mensile', price: '49 euro / mese', description: 'Accesso completo con trial di 14 giorni.' },
    { label: 'Annuale', price: '399 euro / anno', description: 'Risparmio annuale per coach strutturati.' },
  ] as const;
}
