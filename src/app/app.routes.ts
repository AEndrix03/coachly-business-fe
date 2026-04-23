import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app/studio',
    loadComponent: () => import('./features/studio/studio-chooser.component').then((m) => m.StudioChooserComponent),
    title: 'Coachly | Studio',
  },
  {
    path: 'app/studio/:projectId/:pageId',
    loadComponent: () => import('./features/studio/studio-workspace.component').then((m) => m.StudioWorkspaceComponent),
    title: 'Coachly | Studio workspace',
  },
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
