import { ResolveFn } from '@angular/router';

import { getCoachClientById, priorityClients } from '../data/coach-fixtures';
import { ClientDetailRouteData } from '../models/client-detail-route-data';

export const clientDetailResolver: ResolveFn<ClientDetailRouteData> = (route) => {
  const id = route.paramMap.get('id');
  return {
    client: getCoachClientById(id) ?? priorityClients[0],
  };
};
