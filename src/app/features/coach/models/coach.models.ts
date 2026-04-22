export type CoachMode = 'online' | 'in-person' | 'hybrid';
export type ClientStatus = 'active' | 'at-risk' | 'paused' | 'new';
export type ThreadState = 'open' | 'unread' | 'archived';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface CoachProfile {
  handle: string;
  displayName: string;
  bio: string;
  accentColor: string;
  specialties: string[];
  mode: CoachMode;
  acceptsNewClients: boolean;
  responseTime: string;
  verificationStatus: VerificationStatus;
}

export interface PublicPageBlock {
  title: string;
  description: string;
  locked?: boolean;
  label: string;
}

export interface CoachClient {
  id: string;
  name: string;
  status: ClientStatus;
  adherence: number;
  lastSession: string;
  nextCheckIn: string;
  note: string;
  goal: string;
}

export interface CoachThread {
  name: string;
  preview: string;
  state: ThreadState;
  unread: number;
  updatedAt: string;
}

export interface ClientRequest {
  name: string;
  reason: string;
  status: RequestStatus;
  arrival: string;
}

export interface AnalyticsSnapshot {
  visits: string;
  trafficSource: string;
  conversion: string;
  topTag: string;
}

export interface ShareAsset {
  label: string;
  value: string;
}
