import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatToolbarModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly publicHighlights = ['Public page blocks', 'Client acquisition', 'Shareable profile', 'Free / Pro split'];
  protected readonly dashboardMetrics = [
    { value: '18', label: 'Client attivi', icon: 'groups' },
    { value: '6', label: 'Alert bassa aderenza', icon: 'warning' },
    { value: '24', label: 'Richieste pending', icon: 'mail' },
  ];

  protected readonly publicBlocks = [
    {
      icon: 'portrait',
      title: 'Hero blocco',
      description: 'Identita del coach, promessa, CTA e prova sociale senza dipendere da login o backend.',
    },
    {
      icon: 'grid_view',
      title: 'Sistema a blocchi',
      description: 'Sezioni modulari per bio, servizi, gallery, FAQ e sample workout con visibilita free / pro.',
    },
    {
      icon: 'qr_code_2',
      title: 'Share loop',
      description: 'URL, QR e card social per trasformare la pagina pubblica in un funnel di acquisizione.',
    },
  ];

  protected readonly dashboardPanels = [
    {
      title: 'Feed operativo',
      subtitle: 'Ultime azioni di client e coach',
      items: ['Luca B. ha completato Panca Piana 4x10', 'Sara ha saltato 2 sessioni questa settimana', 'Nuovo lead da pagina pubblica'],
    },
    {
      title: 'Clienti da seguire',
      subtitle: 'Priorita in base ad aderenza e frequenza',
      items: ['Marco R. - aderenza 62%', 'Giulia T. - check-in in ritardo', 'Nina S. - PR nuovo sul deadlift'],
    },
  ];
}
