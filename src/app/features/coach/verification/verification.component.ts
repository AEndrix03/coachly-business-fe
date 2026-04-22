import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { coachProfile } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-verification',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Verification</p>
          <h2>Stato UI-only: pending, verified o rejected.</h2>
        </div>
      </section>
      <mat-card class="panel">
        <p class="card-label">Status</p>
        <h3>{{ coachProfile.verificationStatus }}</h3>
        <p>Badge visibile sul profilo pubblico e nel workspace coach.</p>
      </mat-card>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class VerificationComponent {
  protected readonly coachProfile = coachProfile;
}
