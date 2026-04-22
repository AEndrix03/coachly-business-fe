import type { SiteDraft } from './site-draft.models';

export function createDefaultSiteDraft(): SiteDraft {
  return {
    id: 'draft-coachly-001',
    coachId: 'coach-001',
    coachName: 'Coach Aly',
    publishState: 'draft',
    theme: {
      brandName: 'Coachly',
      primaryColor: '#12372a',
      secondaryColor: '#f2ead3',
      accentColor: '#d96c06',
      surfaceColor: '#ffffff',
      textColor: '#111827',
      radius: 'xl',
      fontFamily: 'Aptos, sans-serif',
    },
    assets: [
      { id: 'asset-badge', type: 'badge', label: 'Coach verified', url: '/assets/badge.svg' },
      { id: 'asset-hero', type: 'image', label: 'Hero portrait', url: '/assets/coach-hero.jpg' },
    ],
    localeVariants: [
      { locale: 'it-IT', title: 'Allenamento che converte', slug: 'it', summary: 'Landing principale per il mercato italiano' },
      { locale: 'en-US', title: 'Training that converts', slug: 'en', summary: 'English variant for export and sharing' },
    ],
    pages: [
      {
        id: 'page-home',
        title: 'Homepage',
        slug: 'home',
        summary: 'La pagina che parte dai dati del coach.',
        seo: {
          title: 'Coachly | Training that converts',
          description: 'Un sito coach-native con proof, lead capture e trust layer.',
          keywords: ['coach', 'fitness', 'conversion', 'verification'],
          canonicalUrl: 'https://coachly.example/home',
        },
        sections: [
          {
            id: 'section-hero',
            title: 'Hero',
            purpose: 'intro',
            blocks: [
              {
                id: 'block-hero',
                type: 'hero',
                title: 'Trasforma visite in clienti',
                body: 'Il sito nasce dai tuoi risultati reali, dai clienti attivi e dai tuoi contenuti già verificati.',
                ctaLabel: 'Prenota una call',
                ctaHref: '/app/requests',
                assetIds: ['asset-hero'],
              },
            ],
          },
          {
            id: 'section-proof',
            title: 'Proof',
            purpose: 'trust',
            blocks: [
              {
                id: 'block-proof',
                type: 'proof',
                title: '+32% conversion rate',
                body: 'Un blocco proof che usa alert, analytics e risultati dei clienti come motore editoriale.',
                assetIds: ['asset-badge'],
              },
            ],
          },
        ],
      },
    ],
    aiBrief: 'Costruisci un sito coach-native con conversione, prova sociale e trust visibile.',
    promptHistory: ['brief initiale', 'outline homepage', 'proof copy'],
    updatedAt: new Date().toISOString(),
  };
}

