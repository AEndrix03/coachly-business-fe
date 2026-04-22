# Frontend Guidelines

This document is the canonical frontend standard for `coachly-business-fe`.

## Architecture goals

- Standalone-first Angular 21.
- Public and private areas must be lazy-loaded and separated by shell/layout components.
- Route guards and resolvers belong in `core` or `features/*` as appropriate.
- Keep auth provider-agnostic so a future identity provider can be plugged in without rewriting the router.
- Use signals for local UI state, RxJS for async streams and side effects, NgRx Store for global business state, and SignalStore for feature-local workflow state.

## Folder standard

- `src/app/core`: auth, theme, platform-wide services, guards, and resolvers.
- `src/app/layout`: shell components for public and private areas.
- `src/app/features`: route trees and feature-local orchestration.
- `src/app/pages`: page-level components and templates.
- `src/app/shared`: reusable, presentation-only UI pieces.
- `src/app/data-access`: API clients, repositories, and adapters.

## Routing standard

- Use lazy route trees for major sections.
- Use `canMatch` for route access decisions when a route should not even match.
- Use `resolve` for data required before first paint.
- Add route `title` metadata for top-level and feature routes.
- Prefer parent routes without extra visual chrome; shells own navigation and theme actions.

## State standard

- `signal` and `computed` are for local component state and derived UI state.
- Use `toSignal` and `toObservable` only at the edges of RxJS and signal-based code.
- Keep HTTP and side effects in services.
- NgRx Store is for shared business state.
- NgRx SignalStore is for smaller feature slices, filters, and workflow state.

## Component standard

- Keep container components separate from presentational components.
- Prefer small templates and move branching logic into TypeScript when the template starts to hide the intent.
- Use `protected readonly` for data consumed by templates.
- Use `private readonly` for dependencies and implementation details.
- Favor `inject()` when it improves clarity over constructor injection.

## UI standard

- Tailwind handles layout, spacing, sizing, responsive composition, and page scaffolding.
- Angular Material handles form controls, buttons, navigation, overlays, and accessibility-heavy primitives.
- Use a single Material theme layer with light and dark variants controlled from `html`.
- Keep dark mode and light mode toggles global, not per-component.
- Avoid desktop-only layouts; verify 360px width and common tablet widths.

## Review checklist

- Are public and private routes lazy-loaded?
- Do private routes have guard and resolver coverage?
- Are shell components separated from page components?
- Are theme changes driven by `html` classes?
- Does the layout remain clear on mobile?
- Are components using the right state tool for the job?
