import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../coach/public-page/public-page.component').then((m) => m.CoachPublicPageComponent),
    title: 'Coachly | Public page',
  },
];
