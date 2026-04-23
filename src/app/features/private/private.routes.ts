import { Routes } from '@angular/router';

import { privateAccessGuard } from '../../core/auth/private-access.guard';
import { privateWorkspaceResolver } from './private-data.resolver';
import { clientDetailResolver } from '../coach/client-detail/client-detail.resolver';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    canMatch: [privateAccessGuard],
    resolve: {
      workspace: privateWorkspaceResolver,
    },
    loadComponent: () => import('../../layout/private-shell/private-shell.component').then((m) => m.PrivateShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../coach/dashboard/dashboard.component').then((m) => m.CoachDashboardComponent),
        title: 'Coachly | Workspace',
      },
      {
        path: 'clients',
        loadComponent: () => import('../coach/clients/clients.component').then((m) => m.ClientsComponent),
        title: 'Coachly | Clients',
      },
      {
        path: 'clients/:id',
        loadComponent: () => import('../coach/client-detail/client-detail.component').then((m) => m.ClientDetailComponent),
        resolve: {
          clientDetail: clientDetailResolver,
        },
        title: 'Coachly | Client detail',
      },
      {
        path: 'messages',
        loadComponent: () => import('../coach/messages/messages.component').then((m) => m.MessagesComponent),
        title: 'Coachly | Messages',
      },
      {
        path: 'requests',
        loadComponent: () => import('../coach/requests/requests.component').then((m) => m.RequestsComponent),
        title: 'Coachly | Requests',
      },
      {
        path: 'analytics',
        loadComponent: () => import('../coach/analytics/analytics.component').then((m) => m.AnalyticsComponent),
        title: 'Coachly | Analytics',
      },
      {
        path: 'share',
        loadComponent: () => import('../coach/share/share.component').then((m) => m.ShareComponent),
        title: 'Coachly | Share',
      },
      {
        path: 'settings',
        loadComponent: () => import('../coach/settings/settings.component').then((m) => m.SettingsComponent),
        title: 'Coachly | Settings',
      },
      {
        path: 'verification',
        loadComponent: () => import('../coach/verification/verification.component').then((m) => m.VerificationComponent),
        title: 'Coachly | Verification',
      },
      {
        path: 'upgrade',
        loadComponent: () => import('../coach/upgrade/upgrade.component').then((m) => m.UpgradeComponent),
        title: 'Coachly | Pro',
      },
      {
        path: 'webflow',
        loadComponent: () => import('../coach/webflow/webflow-preview.component').then((m) => m.WebflowPreviewComponent),
        title: 'Coachly | Webflow preview',
      },
    ],
  },
];
