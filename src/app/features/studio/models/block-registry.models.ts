import type { SiteBlock } from './site-draft.models';

export interface BlockDefinition {
  type: SiteBlock['type'];
  label: string;
  editableFields: Array<'title' | 'body' | 'ctaLabel' | 'ctaHref' | 'assetIds'>;
  aiHints: string[];
}

export const COACH_BLOCK_REGISTRY: BlockDefinition[] = [
  { type: 'hero', label: 'Hero', editableFields: ['title', 'body', 'ctaLabel', 'ctaHref'], aiHints: ['conversion', 'headline', 'offer'] },
  { type: 'bio', label: 'Bio', editableFields: ['title', 'body', 'assetIds'], aiHints: ['trust', 'story', 'authority'] },
  { type: 'proof', label: 'Proof', editableFields: ['title', 'body', 'assetIds'], aiHints: ['results', 'metrics', 'social proof'] },
  { type: 'services', label: 'Services', editableFields: ['title', 'body', 'ctaLabel'], aiHints: ['packages', 'programs'] },
  { type: 'pricing', label: 'Pricing', editableFields: ['title', 'body', 'ctaLabel', 'ctaHref'], aiHints: ['plans', 'offers'] },
  { type: 'faq', label: 'FAQ', editableFields: ['title', 'body'], aiHints: ['objections', 'clarity'] },
  { type: 'gallery', label: 'Gallery', editableFields: ['title', 'assetIds'], aiHints: ['visual proof'] },
  { type: 'video', label: 'Video', editableFields: ['title', 'body', 'assetIds'], aiHints: ['intro', 'walkthrough'] },
  { type: 'sample-workout', label: 'Sample workout', editableFields: ['title', 'body', 'assetIds'], aiHints: ['content sample', 'lead magnet'] },
  { type: 'cta', label: 'CTA', editableFields: ['title', 'body', 'ctaLabel', 'ctaHref'], aiHints: ['book call', 'book now'] },
  { type: 'lead-form', label: 'Lead form', editableFields: ['title', 'body', 'ctaLabel'], aiHints: ['contact', 'capture'] },
  { type: 'verification-badge', label: 'Verification', editableFields: ['title', 'body'], aiHints: ['trust layer'] },
  { type: 'share-qr', label: 'Share QR', editableFields: ['title', 'body', 'assetIds'], aiHints: ['distribution', 'share'] },
  { type: 'testimonials', label: 'Testimonials', editableFields: ['title', 'body', 'assetIds'], aiHints: ['quotes', 'reputation'] },
  { type: 'analytics-highlight', label: 'Analytics highlight', editableFields: ['title', 'body'], aiHints: ['growth', 'metrics'] },
];

