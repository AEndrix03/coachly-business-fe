import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudioStateService } from './services/studio-state.service';
import { StudioComponent } from './studio.component';

describe('StudioComponent', () => {
  it('renders a live builder and supports core draft actions', async () => {
    await TestBed.configureTestingModule({
      imports: [StudioComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(StudioComponent);
    fixture.detectChanges();

    const state = TestBed.inject(StudioStateService);
    expect(fixture.nativeElement.textContent).toContain('Coach Studio Builder v2');
    expect(state.draft().pages.length).toBeGreaterThan(0);

    const originalPageCount = state.draft().pages.length;
    state.addPage();
    expect(state.draft().pages.length).toBe(originalPageCount + 1);

    const pageId = state.draft().pages[0].id;
    state.setSelectedPage(pageId);
    state.updateSelectedPage({ title: 'Homepage edited' });
    expect(state.draft().pages[0].title).toBe('Homepage edited');

    state.setSelectedSection(state.draft().pages[0].sections[0].id);
    state.addBlock('cta');
    expect(state.selectedSection().blocks.some((block) => block.type === 'cta')).toBe(true);
  });
});
