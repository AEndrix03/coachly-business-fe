import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatIconModule, MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Coachly Business';

  protected readonly highlightTags = ['CRM coach', 'Agenda smart', 'Pagamenti', 'Analytics'];

  protected readonly metrics = [
    { value: '24/7', label: 'Accesso clienti', icon: 'schedule' },
    { value: '+32%', label: 'Conversione lead', icon: 'trending_up' },
    { value: '7 min', label: 'Setup iniziale', icon: 'rocket_launch' },
  ];

  protected readonly features = [
    {
      icon: 'dashboard',
      title: 'Dashboard operativa',
      description: 'Viste essenziali per monitorare clienti, sessioni, vendite e risultati senza rumore.',
    },
    {
      icon: 'hub',
      title: 'Architettura scalabile',
      description: 'Base Angular 21 gia pronta per routing, componenti standalone e crescita modulare.',
    },
    {
      icon: 'inventory_2',
      title: 'Design system coerente',
      description: 'Tailwind per layout veloci e Material per componenti consistenti e accessibili.',
    },
  ];

  protected readonly milestones = [
    'App bootstrap standalone',
    'Tailwind configurato con PostCSS',
    'Angular Material tematizzato',
    'Build di produzione containerizzato',
  ];
}
