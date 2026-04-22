import {
  AnalyticsSnapshot,
  CoachClient,
  CoachProfile,
  CoachThread,
  ClientRequest,
  PublicPageBlock,
  ShareAsset,
} from '../models/coach.models';

export const coachProfile: CoachProfile = {
  handle: '@coach.marta',
  displayName: 'Marta Riva',
  bio: 'Strength coach per atleti e professionisti che vogliono progressi misurabili, senza frizione.',
  accentColor: '#2563eb',
  specialties: ['Strength', 'Recomp', 'Mobility', 'Return to sport'],
  mode: 'hybrid',
  acceptsNewClients: true,
  responseTime: 'entro 2 ore',
  verificationStatus: 'verified',
};

export const publicPageBlocks: PublicPageBlock[] = [
  { label: 'Free', title: 'Hero + CTA', description: 'Prima impressione, claim forte e invito diretto allazione.' },
  { label: 'Free', title: 'Bio + proof', description: 'Esperienza, risultati, segnali di fiducia e social proof.' },
  { label: 'Pro', title: 'Gallery / Video / Workout', description: 'Contenuti avanzati per trasformare il profilo in funnel.', locked: true },
  { label: 'Pro', title: 'FAQ + custom blocks', description: 'Domande frequenti, sample workout e contenuti premium.', locked: true },
];

export const dashboardMetrics = [
  { value: '18', label: 'clienti attivi', icon: 'groups' },
  { value: '6', label: 'alert aderenza', icon: 'warning' },
  { value: '24', label: 'richieste nuove', icon: 'inbox' },
  { value: '+31%', label: 'contatti dalla public page', icon: 'trending_up' },
];

export const activityFeed = [
  'Luca B. ha completato Panca Piana 4x10',
  'Sara ha saltato 2 sessioni questa settimana',
  'Nuovo lead da pagina pubblica',
  'Marco ha aggiornato il check-in con energia bassa',
];

export const priorityClients: CoachClient[] = [
  {
    id: 'luca-b',
    name: 'Luca B.',
    status: 'at-risk',
    adherence: 62,
    lastSession: '2h fa',
    nextCheckIn: 'domani',
    note: 'Aumentare recupero e monitorare carico.',
    goal: 'Strength focus',
  },
  {
    id: 'giulia-t',
    name: 'Giulia T.',
    status: 'paused',
    adherence: 74,
    lastSession: 'ieri',
    nextCheckIn: 'oggi',
    note: 'Check-in in ritardo, scrivere follow-up.',
    goal: 'Recomposition',
  },
  {
    id: 'nina-s',
    name: 'Nina S.',
    status: 'active',
    adherence: 91,
    lastSession: '4h fa',
    nextCheckIn: 'settimana prossima',
    note: 'Nuovo PR sul deadlift.',
    goal: 'Performance',
  },
];

export const getCoachClientById = (id: string | null | undefined): CoachClient | undefined =>
  priorityClients.find((client) => client.id === id);

export const clientThreads: CoachThread[] = [
  { name: 'Luca B.', preview: 'Ho completato il workout e sento bene la spalla.', state: 'unread', unread: 2, updatedAt: '12m' },
  { name: 'Sara M.', preview: 'Posso spostare la sessione a domani?', state: 'open', unread: 0, updatedAt: '47m' },
  { name: 'Giulia T.', preview: 'Check-in inviato, peso stabile.', state: 'archived', unread: 0, updatedAt: '2d' },
];

export const clientRequests: ClientRequest[] = [
  { name: 'Andrea P.', reason: 'Ha trovato il profilo via Instagram bio.', status: 'pending', arrival: '3m fa' },
  { name: 'Noemi F.', reason: 'Vuole un piano per forza e mobilita.', status: 'accepted', arrival: 'oggi' },
  { name: 'Davide R.', reason: 'Profilo non in target per la nicchia attuale.', status: 'rejected', arrival: 'ieri' },
];

export const analyticsSnapshot: AnalyticsSnapshot = {
  visits: '+18% WoW',
  trafficSource: 'Instagram 54%',
  conversion: 'Views -> contatti 11.8%',
  topTag: 'strength coach',
};

export const shareAssets: ShareAsset[] = [
  { label: 'Link breve', value: 'coachly.io/marta' },
  { label: 'QR pronto', value: 'Salva e condividi in bio' },
  { label: 'Native share', value: 'Invia a WhatsApp / IG' },
];
