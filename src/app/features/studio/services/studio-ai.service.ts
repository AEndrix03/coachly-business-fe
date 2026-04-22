import { Injectable } from '@angular/core';

import type { SiteDraft } from '../models/site-draft.models';

export interface AiPatch {
  scope: 'site' | 'page' | 'block';
  action: 'outline' | 'rewrite' | 'qa' | 'guardrail';
  summary: string;
  changes: string[];
}

@Injectable({ providedIn: 'root' })
export class StudioAiService {
  buildPlan(draft: SiteDraft): AiPatch[] {
    return [
      {
        scope: 'site',
        action: 'outline',
        summary: `Planner per ${draft.coachName}`,
        changes: ['Confermare hero con proposition forte', 'Allineare proof con analytics', 'Mantenere CTA di booking visibili'],
      },
      {
        scope: 'page',
        action: 'rewrite',
        summary: 'Writer per homepage',
        changes: ['Riscrivere il body hero in tono verticale', 'Semplificare FAQ e trust copy', 'Adattare le varianti locali'],
      },
      {
        scope: 'block',
        action: 'qa',
        summary: 'Critic per gate di pubblicazione',
        changes: ['Verificare accessibilità e completezza SEO', 'Bloccare contenuti freeform non validi', 'Segnalare asset mancanti o CTA incoerenti'],
      },
    ];
  }
}

