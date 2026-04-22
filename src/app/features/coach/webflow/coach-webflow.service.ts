import { Injectable } from '@angular/core';
import { TemplateEngine } from '@coachly/super-webflow/engine/template-engine';
import { DataContext, breakpointFromWidth } from '@coachly/super-webflow/engine/data-context';
import { HtmlAdapter } from '@coachly/super-webflow/adapters/html';
import { SemanticValidator } from '@coachly/super-webflow/validator/semantic-validator';

import { coachWebflowTemplate } from './coach-webflow.template';

type ValidationError = ReturnType<SemanticValidator['validate']>['errors'][number];

@Injectable({ providedIn: 'root' })
export class CoachWebflowService {
  private readonly engine = new TemplateEngine();
  private readonly htmlAdapter = new HtmlAdapter({ addTypeClass: true, indent: 2 });
  private readonly semanticValidator = new SemanticValidator();

  validate(): ValidationError[] {
    return this.semanticValidator.validate(coachWebflowTemplate).errors;
  }

  render(width = window.innerWidth): string {
    const bp = breakpointFromWidth(width);
    const context = new DataContext(coachWebflowTemplate.previewData as Record<string, unknown>, coachWebflowTemplate.theme as never, bp, width);
    const root = this.engine.buildPage('home', coachWebflowTemplate as never, context);
    return this.htmlAdapter.render(root);
  }
}
