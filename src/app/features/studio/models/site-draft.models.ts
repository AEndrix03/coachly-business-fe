export type PublishState = 'draft' | 'preview' | 'staged' | 'published';

export interface LocaleVariant {
  locale: string;
  title: string;
  slug: string;
  summary: string;
}

export interface SiteAsset {
  id: string;
  type: 'image' | 'video' | 'document' | 'badge';
  label: string;
  url: string;
}

export interface ThemeKit {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  radius: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: string;
}

export interface SeoProfile {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
}

export interface SiteBlock {
  id: string;
  type:
    | 'hero'
    | 'bio'
    | 'proof'
    | 'services'
    | 'pricing'
    | 'faq'
    | 'gallery'
    | 'video'
    | 'sample-workout'
    | 'cta'
    | 'lead-form'
    | 'verification-badge'
    | 'share-qr'
    | 'testimonials'
    | 'analytics-highlight';
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  assetIds?: string[];
}

export interface SiteSection {
  id: string;
  title: string;
  purpose: 'intro' | 'trust' | 'conversion' | 'support' | 'faq' | 'distribution';
  blocks: SiteBlock[];
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  summary: string;
  seo: SeoProfile;
  sections: SiteSection[];
}

export interface SiteDraft {
  id: string;
  coachId: string;
  coachName: string;
  publishState: PublishState;
  theme: ThemeKit;
  assets: SiteAsset[];
  localeVariants: LocaleVariant[];
  pages: SitePage[];
  aiBrief: string;
  promptHistory: string[];
  updatedAt: string;
}

