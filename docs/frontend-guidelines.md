# Frontend Guidelines

This document defines the default approach for `coachly-business-fe`.

## Goals

- Mobile-first UI that stays readable on small screens.
- Fast initial render and low template complexity.
- Consistent use of Angular Material and Tailwind.
- Accessible interactions by default.

## Core rules

### 1. Build mobile first

- Start with the smallest viewport layout.
- Use Tailwind unprefixed utilities for mobile styles.
- Add `sm:`, `md:`, `lg:` only as progressive enhancements.
- Keep tap targets large enough for touch.

### 2. Keep Angular components focused

- One component per file.
- Put presentation logic in the component.
- Move reusable or non-UI logic out of the template when it starts to grow.
- Prefer `protected` members when a value is only used by the template.

### 3. Keep templates simple

- Avoid deeply nested conditions and heavy expressions in HTML.
- Prefer readable composition over clever one-liners.
- If a template branch becomes hard to scan, move the decision to TypeScript.

### 4. Use Angular Material intentionally

- Use native `<button>` and `<a>` semantics with Material directives.
- Use `mat-flat-button`, `mat-stroked-button`, `mat-icon-button`, etc. where appropriate.
- Add `aria-label` or `aria-labelledby` for icon-only controls.
- Prefer theme tokens and density/typography configuration instead of ad hoc overrides.

### 5. Keep styling structured

- Use Tailwind for layout, spacing, and responsive composition.
- Use component SCSS for page-specific visual treatment and advanced effects.
- Avoid duplicating large chunks of CSS across components.

### 6. Optimize for performance

- Profile before optimizing.
- Split large, non-critical content with `@defer` when it helps initial load.
- Consider `OnPush` for components with heavier rendering work.
- Avoid expensive logic in bindings and repeated computed work in templates.

### 7. Accessibility is not optional

- Preserve semantic headings and landmarks.
- Use descriptive labels for icon-only buttons and controls.
- Keep contrast high enough for text over gradients and cards.
- Make keyboard navigation match the visual order.

## Landing page standard

The first screen of the app should:

- communicate value in one sentence,
- present one primary CTA,
- show one strong visual element,
- remain readable without horizontal scrolling on mobile,
- avoid decorative noise that competes with the headline.

## Review checklist

- Does the layout work at 360px wide?
- Are CTAs still obvious on mobile?
- Is the template easy to read?
- Are Material controls semantically correct?
- Is there any CSS that can be removed or moved into Tailwind utilities?

