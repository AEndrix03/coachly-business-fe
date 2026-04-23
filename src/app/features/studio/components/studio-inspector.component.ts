import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import type { SiteBlock, SitePage, SiteSection } from '../models/site-draft.models';
import type { RightTab, TabDefinition } from '../studio-workspace.types';

@Component({
  standalone: true,
  selector: 'app-studio-inspector',
  imports: [FormsModule, MatButtonModule, MatIconModule],
  template: `
    <aside class="rail rail-right" [attr.aria-hidden]="hidden()">
      <div class="rail-head">
        <div>
          <p class="eyebrow">Inspector</p>
          <h2>Design, prototype, AI</h2>
        </div>
        <button mat-icon-button type="button" (click)="panelToggle.emit()" aria-label="Collapse right rail">
          <mat-icon>{{ collapsed() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
        </button>
      </div>

      <div class="tab-strip">
        @for (tab of tabs(); track tab.id) {
          <button class="tab-btn" type="button" [class.active]="activeTab() === tab.id" (click)="tabChange.emit(tab.id)">
            <mat-icon>{{ tab.icon }}</mat-icon>
            <span>{{ tab.label }}</span>
          </button>
        }
      </div>

      <div class="rail-body">
        @if (activeTab() === 'design') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>Selection</strong>
                <small>{{ selectionPath() || 'Page' }}</small>
              </div>
              <span class="status-chip accent">Design</span>
            </div>

            <div class="focus-strip">
              <span class="focus-chip page">Page</span>
              <span class="focus-chip section">Section</span>
              <span class="focus-chip block">Block</span>
              <span class="focus-chip summary">{{ selectedPage().slug }}</span>
            </div>

            <div class="scope-stack">
              <section class="inspector-card scope-page">
                <div class="panel-lead compact">
                  <div>
                    <p class="mini-label">Page</p>
                    <strong>{{ selectedPage().title }}</strong>
                  </div>
                  <span class="status-chip">Route</span>
                </div>
                <label class="field-label">Page title</label>
                <input class="field" [ngModel]="selectedPage().title" (ngModelChange)="pagePatch.emit({ title: $event })" />
                <label class="field-label">Summary</label>
                <textarea class="field" rows="3" [ngModel]="selectedPage().summary" (ngModelChange)="pagePatch.emit({ summary: $event })"></textarea>
              </section>

              <section class="inspector-card scope-section">
                <div class="panel-lead compact">
                  <div>
                    <p class="mini-label">Section</p>
                    <strong>{{ selectedSection().title }}</strong>
                  </div>
                  <span class="status-chip">Layout</span>
                </div>
                <label class="field-label">Section title</label>
                <input class="field" [ngModel]="selectedSection().title" (ngModelChange)="sectionPatch.emit({ title: $event })" />
                <div class="chip-row">
                  <span class="mini-chip">{{ selectedSection().purpose }}</span>
                  <span class="mini-chip">{{ selectedSection().blocks.length }} blocks</span>
                </div>
              </section>

              <section class="inspector-card scope-block">
                <div class="panel-lead compact">
                  <div>
                    <p class="mini-label">Block</p>
                    <strong>{{ selectedBlock().title }}</strong>
                  </div>
                  <span class="status-chip accent">{{ selectedBlock().type }}</span>
                </div>
                <label class="field-label">Block title</label>
                <input class="field" [ngModel]="selectedBlock().title" (ngModelChange)="blockPatch.emit({ title: $event })" />
                <label class="field-label">Block copy</label>
                <textarea class="field" rows="6" [ngModel]="selectedBlock().body" (ngModelChange)="blockPatch.emit({ body: $event })"></textarea>
                <div class="chip-row">
                  <span class="mini-chip">Drag to reorder</span>
                  <span class="mini-chip">Autosave on route</span>
                  <span class="mini-chip">Undo safe</span>
                </div>
              </section>
            </div>
          </div>
        }

        @if (activeTab() === 'prototype') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>Prototype</strong>
                <small>Flow and interactions</small>
              </div>
              <span class="status-chip accent">On</span>
            </div>

            <div class="prototype-stack">
              <div class="prototype-card">
                <strong>Start point</strong>
                <small>{{ selectedPage().slug }}</small>
              </div>
              <div class="prototype-card">
                <strong>Interaction</strong>
                <small>Click canvas, sidebar and layers stay in sync.</small>
              </div>
              <div class="prototype-card">
                <strong>Shortcut</strong>
                <small>Space = hand, Cmd/Ctrl + K = AI.</small>
              </div>
            </div>
          </div>
        }

        @if (activeTab() === 'ai') {
          <div class="rail-panel">
            <div class="panel-lead">
              <div>
                <strong>AI</strong>
                <small>Contextual actions</small>
              </div>
              <span class="status-chip accent">Spark</span>
            </div>

            <textarea class="field" rows="7" [ngModel]="aiPrompt()" (ngModelChange)="aiPromptChange.emit($event)"></textarea>
            <div class="chip-row">
              @for (prompt of aiPrompts(); track prompt) {
                <button class="mini-chip button" type="button" (click)="aiPromptChange.emit(prompt)">{{ prompt }}</button>
              }
            </div>
            <button mat-flat-button color="primary" type="button" (click)="aiPromptApply.emit(aiPrompt())">Apply AI suggestion</button>

            <div class="prototype-card">
              <strong>Next step</strong>
              <small>{{ nextStep() }}</small>
            </div>
          </div>
        }
      </div>

      <div class="rail-footer">
        <button mat-flat-button color="primary" type="button" (click)="aiPromptApply.emit('Increase trust, shorten the hero, sharpen CTA')">
          Rewrite hero
        </button>
        <button mat-stroked-button type="button" (click)="pageAdd.emit()">Add page</button>
      </div>
    </aside>
  `,
  styles: [':host { display: contents; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioInspectorComponent {
  readonly tabs = input.required<Array<TabDefinition<RightTab>>>();
  readonly activeTab = input.required<RightTab>();
  readonly selectionPath = input.required<string>();
  readonly selectedPage = input.required<SitePage>();
  readonly selectedSection = input.required<SiteSection>();
  readonly selectedBlock = input.required<SiteBlock>();
  readonly aiPrompt = input.required<string>();
  readonly aiPrompts = input.required<string[]>();
  readonly nextStep = input.required<string>();
  readonly collapsed = input.required<boolean>();
  readonly hidden = input.required<boolean>();

  readonly panelToggle = output<void>();
  readonly tabChange = output<RightTab>();
  readonly pagePatch = output<Partial<SitePage>>();
  readonly sectionPatch = output<Partial<SiteSection>>();
  readonly blockPatch = output<Partial<SiteBlock>>();
  readonly aiPromptChange = output<string>();
  readonly aiPromptApply = output<string>();
  readonly pageAdd = output<void>();
}
