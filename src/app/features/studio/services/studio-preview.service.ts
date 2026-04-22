import { Injectable } from '@angular/core';

import { createDefaultSiteDraft } from '../models/site-draft.factory';
import { compileSiteDraftToSuperWebflow } from './site-draft.compiler';

export interface ValidationError {
  path: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class StudioPreviewService {
  private readonly draft = createDefaultSiteDraft();

  getDraft() {
    return this.draft;
  }

  validate(): ValidationError[] {
    const compiled = compileSiteDraftToSuperWebflow(this.draft);
    const errors: ValidationError[] = [];

    if (!compiled.meta.title) errors.push({ path: 'meta.title', message: 'Missing SEO title' });
    if (!compiled.meta.description) errors.push({ path: 'meta.description', message: 'Missing SEO description' });
    if (compiled.validation.blockRegistry.length === 0) {
      errors.push({ path: 'validation.blockRegistry', message: 'No blocks available' });
    }

    return errors;
  }

  render(): string {
    const compiled = compileSiteDraftToSuperWebflow(this.draft);
    const page = compiled.pages['home'] as {
      children: Array<{
        id: string;
        type: string;
        props?: Record<string, unknown>;
      }>;
    };
    const hero = page.children[0];
    const proof = page.children[1];
    const heroTitle = hero?.props?.['text'] ?? this.draft.coachName;
    const heroBody = hero?.props?.['body'] ?? this.draft.aiBrief;
    const proofTitle = proof?.props?.['text'] ?? 'Proof';
    const proofBody = proof?.props?.['body'] ?? '';
    const locales = compiled.previewData['localeVariants'] as Array<unknown> | undefined;
    const assets = compiled.previewData['assets'] as Array<unknown> | undefined;
    const publishState = String(compiled.previewData['publishState'] ?? this.draft.publishState);

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; font-family: ${this.draft.theme.fontFamily}; background: ${this.draft.theme.surfaceColor}; color: ${this.draft.theme.textColor}; }
            .wrap { padding: 48px; display: grid; gap: 24px; }
            .hero, .block { border-radius: 24px; border: 1px solid rgba(17,24,39,.12); padding: 24px; background: white; }
            .hero { background: linear-gradient(135deg, ${this.draft.theme.secondaryColor}, ${this.draft.theme.surfaceColor}); }
            .meta { display: flex; gap: 12px; flex-wrap: wrap; }
            .pill { background: ${this.draft.theme.secondaryColor}; padding: 8px 12px; border-radius: 999px; }
          </style>
        </head>
        <body>
          <main class="wrap">
            <section class="hero">
              <p>Coach custom site studio</p>
              <h1>${heroTitle}</h1>
              <p>${heroBody}</p>
              <div class="meta">
                <span class="pill">${publishState}</span>
                <span class="pill">${locales?.length ?? 0} locales</span>
                <span class="pill">${assets?.length ?? 0} assets</span>
              </div>
            </section>
            <section class="block">
              <h2>${proofTitle}</h2>
              <p>${proofBody}</p>
            </section>
          </main>
        </body>
      </html>
    `;
  }
}
