import { Injectable } from '@angular/core';
import { TemplateEngine } from '@coachly/super-webflow/engine/template-engine';
import { DataContext, breakpointFromWidth } from '@coachly/super-webflow/engine/data-context';
import { HtmlAdapter } from '@coachly/super-webflow/adapters/html';
import { SemanticValidator } from '@coachly/super-webflow/validator/semantic-validator';

import { createDefaultSiteDraft } from '../models/site-draft.factory';
import { compileSiteDraftToSuperWebflow } from './site-draft.compiler';

@Injectable({ providedIn: 'root' })
export class StudioPreviewService {
  private readonly engine = new TemplateEngine();
  private readonly htmlAdapter = new HtmlAdapter({ addTypeClass: true, indent: 2 });
  private readonly semanticValidator = new SemanticValidator();
  private readonly draft = createDefaultSiteDraft();

  getDraft() {
    return this.draft;
  }

  validate() {
    return this.semanticValidator.validate(compileSiteDraftToSuperWebflow(this.draft) as unknown as Record<string, unknown>).errors;
  }

  render(width = 1280): string {
    const compiled = compileSiteDraftToSuperWebflow(this.draft);
    const bp = breakpointFromWidth(width);
    const context = new DataContext(compiled.previewData as Record<string, unknown>, compiled.theme as never, bp, width);
    const root = this.engine.buildPage('home', compiled as never, context);
    return this.htmlAdapter.render(root);
  }
}
