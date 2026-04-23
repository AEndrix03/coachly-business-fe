# Studio Architecture

The Studio is the full-screen editor available at `/app/studio/:projectId/:pageId`.
`/app/studio` remains the chooser and keeps project/page selection outside of the editor chrome.

## Goals

- Keep the workspace route full-screen and independent from the private shell.
- Keep routing, persistence of page selection, shortcuts, and service orchestration in one smart container.
- Keep visual panels as standalone presentational components with explicit inputs and outputs.
- Preserve the Figma-like hierarchy: project, page, section/layer, block/component, inspector.
- Keep the layout usable across desktop, tablet, and mobile with off-canvas rails and a mobile dock.

## Component Map

- `StudioWorkspaceComponent`: smart container for route validation, `StudioStateService`, keyboard shortcuts, mobile drawer state, zoom, active tool, and navigation side effects.
- `StudioTopbarComponent`: presentational top bar. Emits undo, redo, AI, sidebar toggle, and mobile drawer events.
- `StudioNavigatorComponent`: presentational left rail. Shows pages, layers, assets, and registry components. Emits page, section, block, add, and AI events.
- `StudioCanvasComponent`: presentational canvas. Shows the selected page, handles CDK drag/drop events, and emits normalized reorder events.
- `StudioInspectorComponent`: presentational right rail. Shows Design, Prototype, and AI panels. Emits page, section, block, and AI prompt changes.
- `StudioMobileDockComponent`: presentational mobile dock for layers, select, AI, and inspector.
- `studio-workspace.types.ts`: shared UI contracts for tabs, tools, mobile panels, selection, and reorder events.

## Smart Container Rules

- The container owns all mutations by delegating to `StudioStateService`.
- Child components do not inject `StudioStateService`, `Router`, or `ActivatedRoute`.
- Child components emit intent, not implementation details.
- Route changes happen only in `StudioWorkspaceComponent`, currently when a page is selected.
- Shortcut handling stays in the container because it coordinates tools, AI, and mobile drawers.

## Presentational Component Rules

- Components are standalone and use `ChangeDetectionStrategy.OnPush`.
- Inputs use Angular signal inputs through `input.required<T>()`.
- Outputs use `output<T>()` and expose user intent with specific event names.
- Components import only the Angular Material/CDK modules they render directly.
- Components use `:host { display: contents; }` so the global Studio grid treats their inner topbar, rails, canvas, and dock exactly like the original full-screen layout.

## Data Flow

- `StudioStateService` owns the `SiteDraft`, history, redo stack, selected page, selected section, selected block, validation, preview compilation, and AI prompt state.
- `StudioWorkspaceComponent` reads service signals and passes plain values into children.
- User actions flow back through outputs and are converted into service calls in the container.
- Canvas drag/drop emits `StudioBlockReorder`; the container reorders ids through `moveArrayItem` and calls `reorderBlocks`.
- The route page id is synchronized when `selectPage` runs, so refresh keeps the selected page.

## Responsive Behavior

- Desktop keeps the three-column workspace with collapsible left and right rails.
- Under `1180px`, rails become off-canvas drawers controlled by `mobilePanel`.
- The scrim is owned by the container and closes the active mobile drawer.
- The mobile dock is always available on compact viewports and exposes the most important actions.
- Component hosts use `display: contents` to avoid breaking the existing CSS grid and fixed-position rail rules.

## Extension Checklist

- Add new UI-only controls to the closest presentational component.
- Add new state, routing, or service coordination to `StudioWorkspaceComponent` or `StudioStateService`.
- Export shared UI event types from `studio-workspace.types.ts`.
- Keep new component inputs serializable or immutable where possible.
- Avoid passing service instances into presentational components.
- Run `npm run build` and `npm test -- --watch=false` after Studio changes.
