import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StudioCanvasComponent } from './components/studio-canvas.component';
import { StudioInspectorComponent } from './components/studio-inspector.component';
import { StudioMobileDockComponent } from './components/studio-mobile-dock.component';
import { StudioNavigatorComponent } from './components/studio-navigator.component';
import { StudioTopbarComponent } from './components/studio-topbar.component';
import { COACH_BLOCK_REGISTRY } from './models/block-registry.models';
import type { SiteBlock, SitePage, SiteSection } from './models/site-draft.models';
import { StudioStateService } from './services/studio-state.service';
import { getStudioProject } from './studio.catalog';
import type {
  LeftTab,
  MobilePanel,
  RightTab,
  StudioBlockReorder,
  StudioBlockSelection,
  TabDefinition,
  ToolDefinition,
  ToolId,
} from './studio-workspace.types';

@Component({
  standalone: true,
  selector: 'app-studio-workspace',
  imports: [
    StudioCanvasComponent,
    StudioInspectorComponent,
    StudioMobileDockComponent,
    StudioNavigatorComponent,
    StudioTopbarComponent,
  ],
  template: `
    <main
      class="studio-shell"
      [class.left-collapsed]="leftCollapsed()"
      [class.right-collapsed]="rightCollapsed()"
      [class.mobile-left-open]="mobilePanel() === 'left'"
      [class.mobile-right-open]="mobilePanel() === 'right'"
      [style.--studio-accent]="projectAccent()">
      <app-studio-topbar
        [projectName]="projectName()"
        [selectionLabel]="selectionLabel()"
        [publishState]="state.draft().publishState"
        [zoom]="zoom()"
        [issueCount]="state.validationErrors().length"
        [leftCollapsed]="leftCollapsed()"
        [rightCollapsed]="rightCollapsed()"
        [canUndo]="state.canUndo()"
        [canRedo]="state.canRedo()"
        (leftPanelToggle)="toggleLeftPanel()"
        (rightPanelToggle)="toggleRightPanel()"
        (mobilePanelOpen)="openMobilePanel($event)"
        (undo)="state.undo()"
        (redo)="state.redo()"
        (aiOpen)="openAiPanel()" />

      @if (mobilePanel() !== 'none') {
        <button class="mobile-scrim" type="button" aria-label="Close panel" (click)="closeMobilePanel()"></button>
      }

      <section class="workspace-grid">
        <app-studio-navigator
          [draft]="state.draft()"
          [registry]="registry"
          [tabs]="leftTabs"
          [activeTab]="leftTab()"
          [selectedPageId]="state.selectedPageId()"
          [selectedSections]="selectedSections()"
          [selectedSectionId]="state.selectedSectionId()"
          [selectedBlockId]="state.selectedBlockId()"
          [projectName]="projectName()"
          [projectDescription]="projectDescription()"
          [projectOwner]="projectOwner()"
          [projectPageCount]="projectPageCount()"
          [collapsed]="leftCollapsed()"
          [hidden]="mobilePanel() === 'right'"
          (panelToggle)="toggleLeftPanel()"
          (tabChange)="setLeftTab($event)"
          (pageSelected)="selectPage($event)"
          (sectionSelected)="selectSection($event)"
          (blockSelected)="selectBlock($event)"
          (pageAdd)="state.addPage()"
          (sectionAdd)="state.addSection()"
          (ctaBlockAdd)="state.addBlock('cta')"
          (aiOpen)="openAiPanel()" />

        <app-studio-canvas
          [pages]="state.draft().pages"
          [selectedPage]="selectedPage()"
          [selectedPageId]="state.selectedPageId()"
          [selectedSectionId]="state.selectedSectionId()"
          [selectedBlockId]="state.selectedBlockId()"
          [brandName]="state.draft().theme.brandName"
          [zoom]="zoom()"
          [activeTool]="activeTool()"
          [tools]="tools"
          (pageSelected)="selectPage($event)"
          (sectionSelected)="selectSection($event)"
          (blockSelected)="selectBlock($event)"
          (blockReordered)="reorderBlocks($event)"
          (zoomIn)="zoomIn()"
          (zoomOut)="zoomOut()"
          (toolActivated)="activateTool($event)"
          (aiOpen)="openAiPanel()" />

        <app-studio-inspector
          [tabs]="rightTabs"
          [activeTab]="rightTab()"
          [selectionPath]="state.selectionPath()"
          [selectedPage]="selectedPage()"
          [selectedSection]="selectedSection()"
          [selectedBlock]="selectedBlock()"
          [aiPrompt]="state.aiPrompt()"
          [aiPrompts]="aiPrompts"
          [nextStep]="state.nextStep()"
          [collapsed]="rightCollapsed()"
          [hidden]="mobilePanel() === 'left'"
          (panelToggle)="toggleRightPanel()"
          (tabChange)="setRightTab($event)"
          (pagePatch)="updatePage($event)"
          (sectionPatch)="updateSection($event)"
          (blockPatch)="updateBlock($event)"
          (aiPromptChange)="state.setAiPrompt($event)"
          (aiPromptApply)="state.applyAiPrompt($event)"
          (pageAdd)="state.addPage()" />
      </section>

      <app-studio-mobile-dock
        [mobilePanel]="mobilePanel()"
        [activeTool]="activeTool()"
        [rightTab]="rightTab()"
        (panelOpen)="openMobilePanel($event)"
        (toolActivated)="activateTool($event)"
        (aiOpen)="openAiPanel()" />
    </main>
  `,
  styles: [':host { display: block; }'],
})
export class StudioWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly state = inject(StudioStateService);
  protected readonly registry = COACH_BLOCK_REGISTRY;
  protected readonly tools: ToolDefinition[] = [
    { id: 'select', icon: 'ads_click', label: 'Select' },
    { id: 'hand', icon: 'pan_tool_alt', label: 'Hand' },
    { id: 'frame', icon: 'crop_square', label: 'Frame' },
    { id: 'shape', icon: 'rectangle', label: 'Shape' },
    { id: 'text', icon: 'title', label: 'Text' },
    { id: 'comment', icon: 'mode_comment', label: 'Comment' },
    { id: 'connect', icon: 'device_hub', label: 'Connect' },
  ];
  protected readonly leftTabs: Array<TabDefinition<LeftTab>> = [
    { id: 'pages', label: 'Pages', icon: 'layers' },
    { id: 'layers', label: 'Layers', icon: 'account_tree' },
    { id: 'assets', label: 'Assets', icon: 'inventory_2' },
  ];
  protected readonly rightTabs: Array<TabDefinition<RightTab>> = [
    { id: 'design', label: 'Design', icon: 'brush' },
    { id: 'prototype', label: 'Prototype', icon: 'route' },
    { id: 'ai', label: 'AI', icon: 'auto_awesome' },
  ];
  protected readonly aiPrompts = [
    'Sharpen the hero',
    'Increase trust signals',
    'Simplify CTA copy',
    'Turn proof into metrics',
  ];
  protected readonly project = signal(getStudioProject(this.route.snapshot.paramMap.get('projectId')));
  protected readonly projectName = computed(() => this.project()?.name ?? 'Studio');
  protected readonly projectDescription = computed(() => this.project()?.description ?? 'Route-backed workspace');
  protected readonly projectOwner = computed(() => this.project()?.owner ?? 'Coach');
  protected readonly selectionLabel = computed(() => this.state.selectionPath() || this.selectedPage().title);
  protected readonly activeTool = signal<ToolId>('select');
  protected readonly leftTab = signal<LeftTab>('pages');
  protected readonly rightTab = signal<RightTab>('design');
  protected readonly leftCollapsed = signal(false);
  protected readonly rightCollapsed = signal(false);
  protected readonly mobilePanel = signal<MobilePanel>('none');
  protected readonly zoom = signal(100);

  constructor() {
    const projectId = this.route.snapshot.paramMap.get('projectId');
    const pageId = this.route.snapshot.paramMap.get('pageId') ?? undefined;
    const project = getStudioProject(projectId);
    const page = project?.draft.pages.find((item) => item.id === pageId);

    if (!project || !page) {
      void this.router.navigateByUrl('/app/studio');
      return;
    }

    this.project.set(project);
    this.state.loadDraft(project.draft, { pageId });
  }

  projectAccent(): string {
    return this.project()?.accent ?? this.state.draft().theme.primaryColor;
  }

  projectPageCount(): number {
    return this.project()?.draft.pages.length ?? this.state.draft().pages.length;
  }

  selectedPage(): SitePage {
    return this.state.selectedPage();
  }

  selectedSections(): SiteSection[] {
    return this.selectedPage().sections;
  }

  selectedSection(): SiteSection {
    const section = this.state.selectedSection();
    if (!section) throw new Error('Studio draft has no selectable section');
    return section;
  }

  selectedBlock(): SiteBlock {
    const block = this.state.selectedBlock();
    if (!block) throw new Error('Studio draft has no selectable block');
    return block;
  }

  selectPage(pageId: string): void {
    this.state.setSelectedPage(pageId);
    this.leftTab.set('layers');
    const projectId = this.project()?.id;
    if (projectId) {
      void this.router.navigate(['/app/studio', projectId, pageId]);
    }
    this.closeMobilePanel();
  }

  selectSection(sectionId: string): void {
    this.state.setSelectedSection(sectionId);
    this.rightTab.set('design');
    this.closeMobilePanel();
  }

  selectBlock(selection: StudioBlockSelection): void {
    this.state.setSelectedSection(selection.sectionId);
    this.state.setSelectedBlock(selection.blockId);
    this.rightTab.set('design');
    this.closeMobilePanel();
  }

  activateTool(toolId: ToolId): void {
    this.activeTool.set(toolId);
    if (toolId === 'connect') {
      this.rightTab.set('prototype');
    }
  }

  toggleLeftPanel(): void {
    if (this.isCompactViewport()) {
      this.mobilePanel.update((panel) => panel === 'left' ? 'none' : 'left');
      return;
    }
    this.leftCollapsed.update((value) => !value);
  }

  toggleRightPanel(): void {
    if (this.isCompactViewport()) {
      this.mobilePanel.update((panel) => panel === 'right' ? 'none' : 'right');
      return;
    }
    this.rightCollapsed.update((value) => !value);
  }

  setLeftTab(tab: LeftTab): void {
    this.leftTab.set(tab);
  }

  setRightTab(tab: RightTab): void {
    this.rightTab.set(tab);
  }

  openAiPanel(): void {
    this.rightTab.set('ai');
    this.activeTool.set('select');
    if (this.isCompactViewport()) {
      this.mobilePanel.set('right');
    }
  }

  openMobilePanel(panel: Exclude<MobilePanel, 'none'>): void {
    this.mobilePanel.set(panel);
  }

  closeMobilePanel(): void {
    this.mobilePanel.set('none');
  }

  zoomIn(): void {
    this.zoom.update((value) => Math.min(160, value + 10));
  }

  zoomOut(): void {
    this.zoom.update((value) => Math.max(70, value - 10));
  }

  updatePage(patch: Partial<SitePage>): void {
    this.state.updateSelectedPage(patch);
  }

  updateSection(patch: Partial<SiteSection>): void {
    this.state.updateSelectedSection(patch);
  }

  updateBlock(patch: Partial<SiteBlock>): void {
    this.state.updateSelectedBlock(patch);
  }

  reorderBlocks(event: StudioBlockReorder): void {
    const reorderedIds = this.state.moveArrayItem(event.blockIds, event.previousIndex, event.currentIndex);
    this.state.reorderBlocks(reorderedIds, event.sectionId);
  }

  private isTypingTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
  }

  private isCompactViewport(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 1180px)').matches;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeys(event: KeyboardEvent): void {
    if (this.isTypingTarget(event.target)) return;

    if (event.code === 'Space') {
      event.preventDefault();
      this.activateTool('hand');
      return;
    }

    if (event.key === 'Escape') {
      if (this.mobilePanel() !== 'none') {
        this.closeMobilePanel();
        return;
      }
      this.activateTool('select');
      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openAiPanel();
    }
  }

  @HostListener('window:resize')
  handleResize(): void {
    if (!this.isCompactViewport()) {
      this.closeMobilePanel();
    }
  }
}
