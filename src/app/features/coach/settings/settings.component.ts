import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { coachProfile } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-settings',
  imports: [MatCardModule],
  template: `
    <main class="page">
      <section class="section-head">
        <div>
          <p class="eyebrow">Settings</p>
          <h2>Profilo coach, colori, specialita e disponibilita.</h2>
        </div>
      </section>
      <mat-card class="panel">
        <p class="card-label">Handle</p>
        <h3>{{ coachProfile.handle }}</h3>
        <p>{{ coachProfile.bio }}</p>
      </mat-card>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class SettingsComponent {
  protected readonly coachProfile = coachProfile;
}
