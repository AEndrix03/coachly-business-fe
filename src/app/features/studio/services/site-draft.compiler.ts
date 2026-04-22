import type { SiteDraft } from '../models/site-draft.models';

export interface SuperWebflowDocument {
  $schema: string;
  version: string;
  id: string;
  name: string;
  category: string;
  tags: string[];
  author: string;
  type: 'template';
  theme: {
    id: string;
    name: string;
    version: string;
    colors: Record<string, string>;
    typography: { fonts: { heading: string; body: string; mono: string } };
    shadows: Record<string, unknown>;
    zIndex: Record<string, number>;
  };
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  previewData: Record<string, unknown>;
  pages: Record<string, unknown>;
  validation: {
    publishChecklist: string[];
    blockRegistry: Array<{ type: string; label: string }>;
  };
}

export function compileSiteDraftToSuperWebflow(draft: SiteDraft): SuperWebflowDocument {
  const theme = {
    id: `theme-${draft.id}`,
    name: draft.theme.brandName,
    version: '1.0.0',
    colors: {
      primary: draft.theme.primaryColor,
      primaryLight: draft.theme.primaryColor,
      primaryDark: draft.theme.primaryColor,
      secondary: draft.theme.secondaryColor,
      secondaryLight: draft.theme.secondaryColor,
      secondaryDark: draft.theme.secondaryColor,
      accent: draft.theme.accentColor,
      accentLight: draft.theme.accentColor,
      background: draft.theme.surfaceColor,
      backgroundAlt: draft.theme.surfaceColor,
      surface: draft.theme.surfaceColor,
      surfaceAlt: draft.theme.surfaceColor,
      overlay: 'rgba(2,6,23,0.66)',
      text: draft.theme.textColor,
      textSecondary: draft.theme.textColor,
      textMuted: draft.theme.textColor,
      textInverse: draft.theme.surfaceColor,
      textOnPrimary: draft.theme.surfaceColor,
      border: draft.theme.textColor,
      borderStrong: draft.theme.textColor,
      borderFocus: draft.theme.accentColor,
      success: '#16a34a',
      successLight: '#dcfce7',
      warning: '#f59e0b',
      warningLight: '#fef3c7',
      danger: '#ef4444',
      dangerLight: '#fee2e2',
      info: '#38bdf8',
      infoLight: '#e0f2fe',
    },
    typography: { fonts: { heading: draft.theme.fontFamily, body: draft.theme.fontFamily, mono: 'ui-monospace' } },
    shadows: {},
    zIndex: { base: 0, raised: 10, sticky: 50, overlay: 100, modal: 200, popup: 300, tooltip: 400, max: 9999 },
  };

  const homePage = {
    id: 'home-root',
    type: 'page-wrapper',
    props: { includeNavbar: true, includeFooter: true },
    style: { backgroundColor: 'background' },
    children: draft.pages[0]?.sections.map((section) => ({
      id: section.id,
      type: 'section',
      style: { padding: [64, 40] },
      layout: { direction: 'column', gap: 20 },
      children: [
        { id: `${section.id}-title`, type: 'heading', props: { level: 2, text: section.title } },
        ...section.blocks.map((block) => ({
          id: block.id,
          type: block.type,
          props: { label: block.ctaLabel ?? block.title, href: block.ctaHref ?? '#' },
          data: { field: 'coach.fullName' },
          children: [
            { id: `${block.id}-title`, type: 'heading', props: { level: 3, text: block.title } },
            { id: `${block.id}-body`, type: 'paragraph', props: { text: block.body } },
          ],
        })),
      ],
    })) ?? [],
  };

  return {
    $schema: 'https://aredegalli.it/super-webflow/v1.0/template.schema.json',
    version: '1.0',
    id: draft.id,
    name: `${draft.coachName} site draft`,
    category: 'coach',
    tags: ['coach', 'studio', 'ai', 'conversion'],
    author: draft.coachName,
    type: 'template',
    theme,
    meta: {
      title: draft.pages[0]?.seo.title ?? draft.coachName,
      description: draft.pages[0]?.seo.description ?? draft.aiBrief,
      ogImage: draft.assets[0]?.url ?? '',
    },
    previewData: {
      coach: {
        fullName: draft.coachName,
        tagline: draft.aiBrief,
        avatar: draft.assets[0]?.url ?? '',
        bio: draft.pages[0]?.summary ?? draft.aiBrief,
        isPro: draft.publishState !== 'draft',
        stats: [
          { label: 'Pages', value: String(draft.pages.length) },
          { label: 'Locales', value: String(draft.localeVariants.length) },
          { label: 'Assets', value: String(draft.assets.length) },
        ],
        services: draft.pages[0]?.sections.map((section) => ({
          title: section.title,
          description: section.purpose,
        })) ?? [],
      },
      coachName: draft.coachName,
      coachId: draft.coachId,
      publishState: draft.publishState,
      localeVariants: draft.localeVariants,
      assets: draft.assets,
      brief: draft.aiBrief,
      promptHistory: draft.promptHistory,
    },
    pages: { home: homePage },
    validation: {
      publishChecklist: [
        'schema validity',
        'semantic validity',
        'accessibility',
        'seo minimum',
        'trust badge',
        'locale completeness',
      ],
      blockRegistry: draft.pages.flatMap((page) => page.sections.flatMap((section) => section.blocks.map((block) => ({ type: block.type, label: block.title })))),
    },
  };
}
