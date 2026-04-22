import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, UrlTree, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const privateAccessGuard: CanMatchFn = (_route: Route, _segments: UrlSegment[]): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/public']);
};
