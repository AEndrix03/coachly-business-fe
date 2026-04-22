import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { coachProfile, publicPageBlocks } from '../data/coach-fixtures';

@Component({
  standalone: true,
  selector: 'app-coach-public-page',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink],
  template: `
    <main class="page page-public">
      <section class="hero hero-public hero-impact">
        <div class="hero-copy">
          <p class="hero-kicker">Coach discovery page</p>
          <h1>Pagina pubblica editoriale, premium e fatta per convertire.</h1>
          <p class="lead">
            Hero, bio, proof, CTA, FAQ e blocchi Pro bloccati in una struttura chiara. Il teaser del custom website
            resta visivo, ma e marcato come fase successiva.
          </p>

          <div class="actions">
            <button mat-flat-button color="primary">Contatta il coach</button>
            <button mat-stroked-button>Scorri i blocchi</button>
          </div>

          <div class="hero-pills">
            <span class="pill">{{ coachProfile.mode }}</span>
            <span class="pill">{{ coachProfile.responseTime }}</span>
            <span class="pill">{{ coachProfile.verificationStatus }}</span>
          </div>
        </div>

        <mat-card class="hero-card hero-preview hero-panel">
          <p class="card-label">Live preview</p>
          <div class="profile-surface">
            <div class="profile-avatar">MR</div>
            <div class="profile-meta">
              <strong>{{ coachProfile.displayName }}</strong>
              <span>{{ coachProfile.bio }}</span>
            </div>
          </div>
          <div class="snapshot-grid">
            <div class="snapshot-item">
              <mat-icon>verified</mat-icon>
              <strong>Verified</strong>
              <span>Badge visibile</span>
            </div>
            <div class="snapshot-item">
              <mat-icon>qr_code_2</mat-icon>
              <strong>Share</strong>
              <span>Link + QR</span>
            </div>
            <div class="snapshot-item">
              <mat-icon>lock</mat-icon>
              <strong>Pro</strong>
              <span>Blocchi premium</span>
            </div>
          </div>
        </mat-card>
      </section>

      <section class="section-head">
        <div>
          <p class="eyebrow">Coach ideas</p>
          <h2>Dal blocco hero al custom website: il primo passaggio e pronto, il builder arriva dopo.</h2>
        </div>
        <p class="lead compact">
          Questa schermata e il front door della discovery. Il teaser del sito custom esiste solo come riferimento
          visivo, non come strumento di editing ancora.
        </p>
      </section>

      <section class="section-grid">
        @for (block of publicPageBlocks; track block.title) {
          <mat-card class="info-card">
            <div class="icon-badge">
              <mat-icon>{{ block.locked ? 'lock' : 'widgets' }}</mat-icon>
            </div>
            <p class="card-label">{{ block.label }}</p>
            <h3>{{ block.title }}</h3>
            <p>{{ block.description }}</p>
          </mat-card>
        }
      </section>

      <section class="dashboard-layout secondary">
        <mat-card class="panel">
          <p class="card-label">Gallery teaser</p>
          <h3>Reference visual per il custom website</h3>
          <p class="lead compact">Fase successiva: vero builder, asset media e editor drag and drop.</p>
        </mat-card>
        <mat-card class="panel">
          <p class="card-label">FAQ</p>
          <div class="workflow-list">
            <div>Come contatto il coach?</div>
            <div>Quali blocchi Pro posso sbloccare?</div>
            <div>Il sito custom e una fase successiva.</div>
          </div>
        </mat-card>
      </section>

      <section class="dashboard-layout secondary">
        <mat-card class="panel">
          <p class="card-label">Next step</p>
          <h3>Preview tecnico del custom site</h3>
          <p class="lead compact">Nel workspace privato trovi il teaser generato con la libreria super-webflow.</p>
        </mat-card>
        <mat-card class="panel">
          <button mat-flat-button color="primary" routerLink="/app/studio">Apri Studio</button>
        </mat-card>
      </section>
    </main>
  `,
  styleUrl: '../coach-page.shared.scss',
})
export class CoachPublicPageComponent {
  protected readonly coachProfile = coachProfile;
  protected readonly publicPageBlocks = publicPageBlocks;
}
