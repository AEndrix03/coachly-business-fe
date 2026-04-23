# Coachly Business FE

Angular 21 standalone frontend for Coachly.

## Architecture

- Public area is lazy-loaded under `/public`.
- Private workspace is lazy-loaded under `/app`.
- Route protection uses a provider-agnostic auth guard.
- Critical private data is resolved before the page renders.
- Theme is controlled at the document root with `theme-light` and `theme-dark`.
- Tailwind handles layout and spacing; Angular Material handles interactive UI.

## Project rules

- Use standalone components and lazy route trees for new features.
- Keep shell/layout components separate from page components.
- Prefer `signal` for local UI state and RxJS at async boundaries.
- Keep templates simple and move branching logic to TypeScript when needed.
- Use `protected readonly` for values used by templates.

## Key files

- [Frontend guidelines](docs/frontend-guidelines.md)
- [Studio architecture](docs/studio-architecture.md)
- [App routes](src/app/app.routes.ts)
- [Public shell](src/app/layout/public-shell/public-shell.component.ts)
- [Private shell](src/app/layout/private-shell/private-shell.component.ts)
- [Theme service](src/app/core/theme/theme.service.ts)

## Commands

```bash
npm run start
npm run build
npm run test
```
