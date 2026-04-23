import type { SiteDraft } from './models/site-draft.models';
import { createDefaultSiteDraft } from './models/site-draft.factory';

export interface StudioProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'draft' | 'review' | 'published';
  accent: string;
  draft: SiteDraft;
}

export const STUDIO_PROJECTS: StudioProject[] = [
  {
    id: 'coachly-main',
    name: 'Coachly Main Site',
    description: 'Workspace principale con homepage, proof e lead capture.',
    owner: 'Coach Aly',
    status: 'draft',
    accent: '#12372a',
    draft: createDefaultSiteDraft(),
  },
  {
    id: 'coachly-growth',
    name: 'Growth Landing',
    description: 'Landing focalizzata su conversione e offerte stagionali.',
    owner: 'Coach Aly',
    status: 'review',
    accent: '#0f766e',
    draft: {
      ...createDefaultSiteDraft(),
      id: 'draft-coachly-growth',
      coachName: 'Coach Aly',
      aiBrief: 'Landing breve, forte e centrata su prenotazione call.',
      theme: {
        ...createDefaultSiteDraft().theme,
        brandName: 'Coachly Growth',
        primaryColor: '#0f766e',
        secondaryColor: '#e6fffb',
        accentColor: '#14b8a6',
        surfaceColor: '#ffffff',
        textColor: '#0f172a',
      },
      pages: createDefaultSiteDraft().pages.slice(0, 1),
    },
  },
];

export function getStudioProject(projectId: string | null | undefined): StudioProject | undefined {
  if (!projectId) return undefined;
  return STUDIO_PROJECTS.find((project) => project.id === projectId);
}
