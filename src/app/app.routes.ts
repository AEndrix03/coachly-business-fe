import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'public',
  },
  {
    path: 'public',
    loadComponent: () => import('./pages/public-page.component').then((m) => m.PublicPageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/coach-dashboard.component').then((m) => m.CoachDashboardComponent),
  },
  {
    path: '**',
    redirectTo: 'public',
  },
];
