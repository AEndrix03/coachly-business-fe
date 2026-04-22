import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'public',
  },
  {
    path: 'public',
    loadChildren: () => import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
    title: 'Coachly | Public',
  },
  {
    path: 'app',
    loadChildren: () => import('./features/private/private.routes').then((m) => m.PRIVATE_ROUTES),
    title: 'Coachly | App',
  },
  {
    path: '**',
    redirectTo: 'public',
  },
];
