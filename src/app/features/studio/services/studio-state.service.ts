import { Injectable, computed, signal } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { COACH_BLOCK_REGISTRY } from '../models/block-registry.models';
import { createDefaultSiteDraft } from '../models/site-draft.factory';
import type {
  PublishState,
  SiteBlock,
  SiteDraft,
  SitePage,
  SiteSection,
  ThemeKit,
} from '../models/site-draft.models';
import { compileSiteDraftToSuperWebflow } from './site-draft.compiler';

export interface ValidationError {
  path: string;
  message: string;
}

const DEFAULT_AI_PROMPT = 'Amplifica proof, trust e call to action.';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function cloneDraft(draft: SiteDraft): SiteDraft {
  return structuredClone(draft);
}

function defaultBlockForType(type: SiteBlock['type']): SiteBlock {
  const definition = COACH_BLOCK_REGISTRY.find((block) => block.type === type);
  return {
    id: createId(`block-${type}`),
    type,
    title: definition?.label ?? type,
    body: `Contenuto iniziale per ${definition?.label ?? type}.`,
    ctaLabel: type === 'cta' ? 'Prenota ora' : undefined,
    ctaHref: type === 'cta' ? '/app/requests' : undefined,
    assetIds: [],
  };
}

function firstPageOrThrow(draft: SiteDraft): SitePage {
  const page = draft.pages[0];
  if (!page) throw new Error('Draft has no pages');
  return page;
}

@Injectable({ providedIn: 'root' })
export class StudioStateService {
  private readonly draftSignal = signal<SiteDraft>(createDefaultSiteDraft());
  private readonly history: SiteDraft[] = [];
  private readonly redoStack: SiteDraft[] = [];
  readonly draft = this.draftSignal.asReadonly();
  readonly compiled = computed(() => compileSiteDraftToSuperWebflow(this.draftSignal()));
  readonly previewHtml = computed(() => this.renderPreviewHtml());
  readonly validationErrors = computed(() => this.validate());
  readonly publishChecklist = computed(() => this.compiled().validation.publishChecklist);
  readonly selectedPageId = signal<string>(firstPageOrThrow(this.draftSignal()).id);
  readonly selectedSectionId = signal<string>(firstPageOrThrow(this.draftSignal()).sections[0]?.id ?? '');
  readonly selectedBlockId = signal<string>(firstPageOrThrow(this.draftSignal()).sections[0]?.blocks[0]?.id ?? '');
  readonly aiPrompt = signal<string>(DEFAULT_AI_PROMPT);
  readonly leftRailCollapsed = signal(false);
  readonly rightRailCollapsed = signal(false);

  readonly selectedPage = computed(() => this.draft().pages.find((page) => page.id === this.selectedPageId()) ?? this.draft().pages[0]);
  readonly selectedSection = computed(() => this.selectedPage()?.sections.find((section) => section.id === this.selectedSectionId()) ?? this.selectedPage()?.sections[0]);
  readonly selectedBlock = computed(() => this.selectedSection()?.blocks.find((block) => block.id === this.selectedBlockId()) ?? this.selectedSection()?.blocks[0]);
  readonly selectionPath = computed(() => {
    const page = this.selectedPage();
    const section = this.selectedSection();
    const block = this.selectedBlock();
    return [page?.title, section?.title, block?.title].filter(Boolean).join(' / ');
  });
  readonly nextStep = computed(() => {
    if (!this.selectedPage()) return 'Seleziona una pagina per iniziare.';
    if (!this.selectedSection()) return 'Seleziona una sezione da modificare.';
    if (!this.selectedBlock()) return 'Seleziona un blocco e cambia testo o CTA.';
    if (this.validationErrors().length > 0) return 'Controlla gli avvisi di validazione prima di pubblicare.';
    return 'Il draft è pronto per la preview.';
  });

  exportDraftJson(): string {
    return JSON.stringify(this.draft(), null, 2);
  }

  setSelectedPage(pageId: string): void {
    this.selectedPageId.set(pageId);
    const page = this.draft().pages.find((item) => item.id === pageId);
    this.selectedSectionId.set(page?.sections[0]?.id ?? '');
    this.selectedBlockId.set(page?.sections[0]?.blocks[0]?.id ?? '');
  }

  setSelectedSection(sectionId: string): void {
    this.selectedSectionId.set(sectionId);
    const section = this.selectedPage()?.sections.find((item) => item.id === sectionId);
    this.selectedBlockId.set(section?.blocks[0]?.id ?? '');
  }

  setSelectedBlock(blockId: string): void {
    this.selectedBlockId.set(blockId);
  }

  loadDraft(draft: SiteDraft, selection?: { pageId?: string; sectionId?: string; blockId?: string }): void {
    const nextDraft = cloneDraft(draft);
    this.history.length = 0;
    this.redoStack.length = 0;
    this.draftSignal.set(nextDraft);
    this.syncSelectionToDraft(nextDraft, selection);
  }

  updateDraft(mutator: (draft: SiteDraft) => void): void {
    const next = cloneDraft(this.draftSignal());
    this.history.push(cloneDraft(this.draftSignal()));
    this.redoStack.length = 0;
    mutator(next);
    next.updatedAt = new Date().toISOString();
    this.draftSignal.set(next);
  }

  canUndo(): boolean {
    return this.history.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  undo(): void {
    const preferredSelection = this.getSelection();
    const previous = this.history.pop();
    if (!previous) return;
    this.redoStack.push(cloneDraft(this.draftSignal()));
    this.draftSignal.set(previous);
    this.syncSelectionToDraft(previous, preferredSelection);
  }

  redo(): void {
    const preferredSelection = this.getSelection();
    const next = this.redoStack.pop();
    if (!next) return;
    this.history.push(cloneDraft(this.draftSignal()));
    this.draftSignal.set(next);
    this.syncSelectionToDraft(next, preferredSelection);
  }

  toggleLeftRail(): void {
    this.leftRailCollapsed.update((value) => !value);
  }

  toggleRightRail(): void {
    this.rightRailCollapsed.update((value) => !value);
  }

  setAiPrompt(prompt: string): void {
    this.aiPrompt.set(prompt);
  }

  private restoreSelection(draft: SiteDraft): void {
    this.syncSelectionToDraft(draft, this.getSelection());
  }

  private syncSelectionToDraft(
    draft: SiteDraft,
    preferred?: { pageId?: string; sectionId?: string; blockId?: string },
  ): void {
    const page = draft.pages.find((item) => item.id === preferred?.pageId) ?? draft.pages[0];
    const section = page?.sections.find((item) => item.id === preferred?.sectionId) ?? page?.sections[0];
    const block = section?.blocks.find((item) => item.id === preferred?.blockId) ?? section?.blocks[0];

    this.selectedPageId.set(page?.id ?? '');
    this.selectedSectionId.set(section?.id ?? '');
    this.selectedBlockId.set(block?.id ?? '');
  }

  updateCoachField(field: 'coachName' | 'aiBrief' | 'publishState'): void {
    this.updateDraft((draft) => {
      if (field === 'publishState') {
        draft.publishState = (draft.publishState === 'draft' ? 'preview' : draft.publishState) as PublishState;
      }
    });
  }

  updateTheme(theme: Partial<ThemeKit>): void {
    this.updateDraft((draft) => {
      draft.theme = { ...draft.theme, ...theme };
    });
  }

  updateSelectedPage(patch: Partial<SitePage>): void {
    const pageId = this.selectedPageId();
    this.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === pageId);
      if (!page) return;
      Object.assign(page, patch);
    });
  }

  updateSelectedSection(patch: Partial<SiteSection>): void {
    const pageId = this.selectedPageId();
    const sectionId = this.selectedSectionId();
    this.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === pageId)?.sections.find((item) => item.id === sectionId);
      if (!section) return;
      Object.assign(section, patch);
    });
  }

  updateSelectedBlock(patch: Partial<SiteBlock>): void {
    const ids = this.getSelection();
    if (!ids.blockId) return;
    this.updateDraft((draft) => {
      const block = draft.pages.find((item) => item.id === ids.pageId)?.sections.find((item) => item.id === ids.sectionId)?.blocks.find((item) => item.id === ids.blockId);
      if (!block) return;
      Object.assign(block, patch);
    });
  }

  addPage(): void {
    this.updateDraft((draft) => {
      draft.pages.push({
        id: createId('page'),
        title: 'Nuova pagina',
        slug: `page-${draft.pages.length + 1}`,
        summary: 'Pagina iniziale generata dal builder.',
        seo: {
          title: `${draft.coachName} | Nuova pagina`,
          description: draft.aiBrief,
          keywords: ['coach', 'studio'],
          canonicalUrl: `https://coachly.example/page-${draft.pages.length + 1}`,
        },
        sections: [
          {
            id: createId('section'),
            title: 'Intro',
            purpose: 'intro',
            blocks: [defaultBlockForType('hero')],
          },
        ],
      });
    });
  }

  removePage(pageId: string): void {
    this.updateDraft((draft) => {
      draft.pages = draft.pages.filter((page) => page.id !== pageId);
      if (draft.pages.length === 0) {
        draft.pages = createDefaultSiteDraft().pages;
      }
    });
    this.syncSelectionToDraft(this.draft(), this.getSelection());
  }

  addSection(): void {
    const pageId = this.selectedPageId();
    this.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === pageId);
      if (!page) return;
      page.sections.push({
        id: createId('section'),
        title: 'Nuova sezione',
        purpose: 'support',
        blocks: [defaultBlockForType('proof')],
      });
    });
  }

  removeSection(sectionId: string): void {
    this.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === this.selectedPageId());
      if (!page) return;
      page.sections = page.sections.filter((section) => section.id !== sectionId);
    });
    this.syncSelectionToDraft(this.draft(), this.getSelection());
  }

  addBlock(type: SiteBlock['type']): void {
    const ids = this.getSelection();
    this.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === ids.pageId)?.sections.find((item) => item.id === ids.sectionId);
      if (!section) return;
      section.blocks.push(defaultBlockForType(type));
    });
  }

  removeBlock(blockId: string): void {
    this.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === this.selectedPageId())?.sections.find((item) => item.id === this.selectedSectionId());
      if (!section) return;
      section.blocks = section.blocks.filter((block) => block.id !== blockId);
    });
    this.syncSelectionToDraft(this.draft(), this.getSelection());
  }

  moveSection(sectionId: string, direction: -1 | 1): void {
    this.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === this.selectedPageId());
      if (!page) return;
      const index = page.sections.findIndex((section) => section.id === sectionId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= page.sections.length) return;
      [page.sections[index], page.sections[target]] = [page.sections[target], page.sections[index]];
    });
  }

  reorderSections(sectionIds: string[]): void {
    this.updateDraft((draft) => {
      const page = draft.pages.find((item) => item.id === this.selectedPageId());
      if (!page) return;
      page.sections = sectionIds.map((id) => page.sections.find((section) => section.id === id)).filter((section): section is SiteSection => Boolean(section));
    });
  }

  moveBlock(blockId: string, direction: -1 | 1): void {
    this.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === this.selectedPageId())?.sections.find((item) => item.id === this.selectedSectionId());
      if (!section) return;
      const index = section.blocks.findIndex((block) => block.id === blockId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= section.blocks.length) return;
      [section.blocks[index], section.blocks[target]] = [section.blocks[target], section.blocks[index]];
    });
  }

  reorderBlocks(blockIds: string[]): void {
    this.updateDraft((draft) => {
      const section = draft.pages.find((item) => item.id === this.selectedPageId())?.sections.find((item) => item.id === this.selectedSectionId());
      if (!section) return;
      section.blocks = blockIds.map((id) => section.blocks.find((block) => block.id === id)).filter((block): block is SiteBlock => Boolean(block));
    });
  }

  moveArrayItem<T>(items: T[], previousIndex: number, currentIndex: number): T[] {
    const next = [...items];
    moveItemInArray(next, previousIndex, currentIndex);
    return next;
  }

  applyAiPrompt(prompt: string): void {
    const query = prompt.trim().toLowerCase();
    if (!query) return;

    this.updateDraft((draft) => {
      draft.promptHistory.unshift(prompt.trim());
      draft.aiBrief = prompt.trim();

      const hero = draft.pages[0]?.sections[0]?.blocks[0];
      const proof = draft.pages[0]?.sections[1]?.blocks[0];

      if (hero) {
        hero.title = query.includes('headline') || query.includes('hero') ? 'Più chiarezza, più conversione' : hero.title;
        hero.body = query.includes('proof')
          ? 'Metti in evidenza risultati verificati, clienti attivi e segnali di fiducia direttamente sopra la piega.'
          : hero.body;
        hero.ctaLabel = query.includes('call') ? 'Prenota una call' : hero.ctaLabel;
      }

      if (proof) {
        proof.title = query.includes('proof') ? 'Prova sociale reale' : proof.title;
        proof.body = query.includes('analytics')
          ? 'Integra dati reali di clienti, richieste e analytics come blocchi editoriali pronti da pubblicare.'
          : proof.body;
      }
    });
  }

  private getSelection() {
    return {
      pageId: this.selectedPageId(),
      sectionId: this.selectedSectionId(),
      blockId: this.selectedBlockId(),
    };
  }

  validate(): ValidationError[] {
    const compiled = this.compiled();
    const errors: ValidationError[] = [];

    if (!compiled.meta.title) errors.push({ path: 'meta.title', message: 'Missing SEO title' });
    if (!compiled.meta.description) errors.push({ path: 'meta.description', message: 'Missing SEO description' });
    if (compiled.validation.blockRegistry.length === 0) errors.push({ path: 'validation.blockRegistry', message: 'No blocks available' });
    if (!this.draft().pages.length) errors.push({ path: 'draft.pages', message: 'At least one page is required' });

    return errors;
  }

  renderPreviewHtml(): string {
    const compiled = this.compiled();
    const page = compiled.pages['home'] as { children?: Array<{ props?: Record<string, unknown>; children?: Array<{ props?: Record<string, unknown> }> }> };
    const hero = page?.children?.[0];
    const proof = page?.children?.[1];
    const heroTitle = String(hero?.children?.[0]?.props?.['text'] ?? this.draft().coachName);
    const heroBody = String(hero?.children?.[1]?.props?.['text'] ?? this.draft().aiBrief);
    const proofTitle = String(proof?.children?.[0]?.props?.['text'] ?? 'Proof');
    const proofBody = String(proof?.children?.[1]?.props?.['text'] ?? '');
    const locales = compiled.previewData['localeVariants'] as Array<unknown> | undefined;
    const assets = compiled.previewData['assets'] as Array<unknown> | undefined;
    const publishState = String(compiled.previewData['publishState'] ?? this.draft().publishState);

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { margin: 0; font-family: ${this.draft().theme.fontFamily}; background: linear-gradient(180deg, ${this.draft().theme.secondaryColor}, ${this.draft().theme.surfaceColor}); color: ${this.draft().theme.textColor}; }
            .wrap { padding: 32px; display: grid; gap: 20px; }
            .hero, .block { border-radius: 24px; border: 1px solid rgba(17,24,39,.12); padding: 24px; background: white; }
            .meta { display: flex; gap: 10px; flex-wrap: wrap; }
            .pill { background: ${this.draft().theme.secondaryColor}; padding: 8px 12px; border-radius: 999px; }
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
