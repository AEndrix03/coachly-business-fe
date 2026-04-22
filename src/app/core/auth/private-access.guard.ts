import { CanMatchFn, Route, UrlSegment } from '@angular/router';

// TODO: Re-enable access control here once the studio flow and login gating are finalized.
export const privateAccessGuard: CanMatchFn = (_route: Route, _segments: UrlSegment[]): boolean => {
  return true;
};
