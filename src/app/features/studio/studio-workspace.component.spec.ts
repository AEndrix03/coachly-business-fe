import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { StudioStateService } from './services/studio-state.service';
import { StudioWorkspaceComponent } from './studio-workspace.component';

describe('StudioWorkspaceComponent', () => {
  it('loads a project draft and keeps editing actions working', async () => {
    await TestBed.configureTestingModule({
      imports: [StudioWorkspaceComponent],
      providers: [
        provideRouter([
          { path: 'app/studio/:projectId/:pageId', component: StudioWorkspaceComponent },
        ]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ projectId: 'coachly-main', pageId: 'page-home' }) } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(StudioWorkspaceComponent);
    fixture.detectChanges();

    const state = TestBed.inject(StudioStateService);
    expect(state.draft().pages.length).toBeGreaterThan(0);
    expect(state.selectedPage()).toBeTruthy();

    const originalPageCount = state.draft().pages.length;
    state.addPage();
    expect(state.draft().pages.length).toBe(originalPageCount + 1);
  });
});
