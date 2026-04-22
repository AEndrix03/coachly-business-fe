import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should route public traffic to the public shell', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/public');
    expect(router.url).toBe('/public');
  });

  it('should allow private traffic while the guard is temporarily disabled', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/app');
    expect(router.url).toBe('/app');
  });

  it('should allow private traffic after login', async () => {
    const authService = TestBed.inject(AuthService);
    authService.login();

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/app/clients');
    expect(router.url).toBe('/app/clients');
  });
});
