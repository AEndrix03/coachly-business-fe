import { Injectable } from '@angular/core';

import { coachWebflowTemplate } from './coach-webflow.template';

export interface ValidationError {
  path: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CoachWebflowService {
  validate(): ValidationError[] {
    const errors: ValidationError[] = [];
    if (!coachWebflowTemplate.pages?.home) {
      errors.push({ path: 'pages.home', message: 'Missing home page' });
    }
    return errors;
  }

  render(): string {
    const coach = coachWebflowTemplate.previewData.coach;
    const stats = coach.stats
      .map((stat) => `<div class="card"><strong>${stat.value}</strong><span>${stat.label}</span></div>`)
      .join('');
    const services = coach.services
      .map((service) => `<li><strong>${service.title}</strong><p>${service.description}</p></li>`)
      .join('');

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #0b1220; color: #f8fafc; }
            .hero { padding: 48px; display: grid; gap: 24px; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
            .card { background: #111827; border: 1px solid #243043; border-radius: 16px; padding: 18px; }
            ul { list-style: none; padding: 0; display: grid; gap: 12px; }
            li { background: #111827; border-radius: 16px; padding: 18px; border: 1px solid #243043; }
            h1 { margin: 0; font-size: 48px; }
            p { color: #cbd5e1; }
          </style>
        </head>
        <body>
          <section class="hero">
            <p>Super Webflow runtime</p>
            <h1>${coach.fullName}</h1>
            <p>${coach.tagline}</p>
            <div class="stats">${stats}</div>
            <ul>${services}</ul>
          </section>
        </body>
      </html>
    `;
  }
}

