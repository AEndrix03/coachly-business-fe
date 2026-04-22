import { ResolveFn } from '@angular/router';

export interface PrivateWorkspaceData {
  activeClients: number;
  alerts: number;
  tasks: string[];
}

export const privateWorkspaceResolver: ResolveFn<PrivateWorkspaceData> = () => ({
  activeClients: 18,
  alerts: 6,
  tasks: ['Review overdue check-ins', 'Send weekly recap', 'Flag new lead'],
});
