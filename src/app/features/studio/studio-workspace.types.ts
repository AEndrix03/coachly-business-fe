import type { SiteBlock } from './models/site-draft.models';

export type LeftTab = 'pages' | 'layers' | 'assets';
export type RightTab = 'design' | 'prototype' | 'ai';
export type ToolId = 'select' | 'hand' | 'frame' | 'shape' | 'text' | 'comment' | 'connect';
export type MobilePanel = 'none' | 'left' | 'right';

export interface TabDefinition<TId extends string> {
  id: TId;
  icon: string;
  label: string;
}

export interface ToolDefinition extends TabDefinition<ToolId> {}

export interface StudioBlockSelection {
  sectionId: string;
  blockId: string;
}

export interface StudioBlockReorder {
  sectionId: string;
  blockIds: Array<SiteBlock['id']>;
  previousIndex: number;
  currentIndex: number;
}
