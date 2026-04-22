import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CoachPublicPageComponent } from './public-page/public-page.component';
import { CoachDashboardComponent } from './dashboard/dashboard.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';

describe('Coach pages', () => {
  const activatedRouteStub = {
    snapshot: {
      paramMap: convertToParamMap({}),
    },
  };

  it('renders the public page hero and locked blocks', async () => {
    await TestBed.configureTestingModule({
      imports: [CoachPublicPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoachPublicPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Pagina pubblica editoriale');
    expect(fixture.nativeElement.textContent).toContain('Gallery / Video / Workout');
  });

  it('renders the dashboard with metrics', async () => {
    await TestBed.configureTestingModule({
      imports: [CoachDashboardComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CoachDashboardComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('clienti attivi');
    expect(fixture.nativeElement.textContent).toContain('Ultime azioni rilevanti');
  });

  it('renders the client list with detail links', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ClientsComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Apri dettaglio');
  });

  it('uses the resolved client on the client detail page', async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                clientDetail: {
                  client: {
                    id: 'nina-s',
                    name: 'Nina S.',
                    status: 'active',
                    adherence: 91,
                    lastSession: '4h fa',
                    nextCheckIn: 'settimana prossima',
                    note: 'Nuovo PR sul deadlift.',
                    goal: 'Performance',
                  },
                },
              },
              paramMap: convertToParamMap({ id: 'nina-s' }),
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ClientDetailComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('nina-s');
    expect(fixture.nativeElement.textContent).toContain('Nina S.');
  });
});
